<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Routing\Attributes\Controllers\Middleware;
//use Illuminate\Support\Facades\Auth;
use App\Mail\SendMail;
use Illuminate\Support\Facades\Mail;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Middleware('permission:listar pagos')]
    public function index(Request $request)
    {
        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        $camposPermitidos = ['id', 'fecha_pago', 'monto', 'metodo_pago'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $user = $request->user();
        $esAdmin = $user->hasRole(['admin', 'super']);
        $esCliente = $user->hasRole('client');

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        $query = Payment::with([
            'subscription.client' => function ($clientQuery) {
                $clientQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            },
            'subscription.plan',
            'employee' => function ($empQuery) {
                $empQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            }
        ]);

        // Filtro de Papelera (Exclusivo Admin)
        $query->when($esAdmin && $papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($esAdmin && $papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        $query->when($esCliente && $user->client, function ($q) use ($user) {
            $q->whereHas('subscription', function ($subQ) use ($user) {
                $subQ->where('client_id', $user->client->id);
            });
        });

        $query->when($buscar !== '', function ($q) use ($buscar, $papelera) {
            $q->where(function ($subQ) use ($buscar, $papelera) {

                if (is_numeric($buscar)) {
                    $subQ->where('payments.id', $buscar)
                        ->orWhere('payments.subscription_id', $buscar);
                }

                $subQ->orWhereHas('subscription.client', function ($clientQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $clientQuery->withTrashed();
                    }
                    $clientQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });

                $subQ->orWhereHas('employee', function ($empQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $empQuery->withTrashed();
                    }
                    $empQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });
            });
        });

        // Ordenamiento dinámico seguro
        $query->orderBy("payments.{$orden}", $direccion)->orderBy('id', 'desc');

        // Paginación limpia
        $pagos = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Pagos/Index', [
            'pagos' => $pagos,
            'filtros' => [
                'buscar'     => $buscar,
                'orden'      => $orden,
                'direccion'  => $direccion,
                'por_pagina' => $porPagina,
                'papelera'   => $papelera,
            ],
            'esAdmin' => $esAdmin,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Middleware('permission:crear pago')]
    public function create()
    {

        $suscripciones = Subscription::with(['client.user', 'plan'])
            ->where('estado', 'pendiente')
            ->get();

        $fecha = Carbon::today()->toDateString();

        return Inertia::render('Pagos/Create', ['suscripciones' => $suscripciones, 'fecha' => $fecha]);
    }

    /**
     * Store a newly created resource in storage.
     */

    #[Middleware('permission:crear pago')]
    public function store(StorePaymentRequest $request)
    {
        $datos = $request->validated();
        $datos['fecha_pago'] = Carbon::today()->toDateString();
        $user = $request->user();
        $suscripcion = Subscription::with('client.user', 'plan')->findOrFail($datos['subscription_id']);
        $totalPagadoPrevio = Payment::where('subscription_id', $suscripcion->id)->sum('monto');
        $saldoPendiente = $suscripcion->precio - $totalPagadoPrevio;

        if ($datos['monto'] > $saldoPendiente) {
            return back()->withErrors([
                'monto' => "El monto ingresado ($" . number_format($datos['monto'], 2) . ") supera el saldo pendiente de la suscripción ($" . number_format($saldoPendiente, 2) . ")."
            ]);
        }

        if ($user && $user->employee) {
            $datos['employee_id'] = $user->employee->id;
        } else {
            $adminEmpleado = User::where('name', 'Administracion')->first();
            $datos['employee_id'] = $adminEmpleado->employee->id;
        }

        Payment::create($datos);

        if (($totalPagadoPrevio + $datos['monto']) >= $suscripcion->precio) {
            $suscripcion->update(['estado' => 'activa']);
        }

        $cliente = $suscripcion->client->user;

        $nombre = $cliente->name;
        $correo = $cliente->email;

        // $datos ya estaba ocupado
        $info = array(
            'nombre' => $nombre,
            'correo' => $correo,
            'suscripcion' => $datos['subscription_id'],
            'plan' => $suscripcion->plan->nombre,
            'fecha' => $datos['fecha_pago'],
            'monto' => $datos['monto'],
        );

        Mail::to($info['correo'])->send(new SendMail($info));

        return redirect()->route('pagos.index')->with('success', 'Pago creado correctamente');
    }

    /**
     * Display the specified resource.
     */

    #[Middleware('permission:mostrar pago')]
    public function show(Payment $pago)
    {
        $pago->load(['subscription.plan', 'employee.user']);

        return Inertia::render('Pagos/Show', ['pago' => $pago]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    #[Middleware('permission:editar pago')]
    public function edit(Payment $pago)
    {

        $suscripciones = Subscription::with(['client.user', 'plan'])
            ->where('estado', 'pendiente')
            ->orWhere('id', $pago->subscription_id)
            ->get();

        $pago->load(['subscription.plan', 'employee.user']);

        return Inertia::render('Pagos/Edit', ['pago' => $pago, 'suscripciones' => $suscripciones]);
    }

    /**
     * Update the specified resource in storage.
     */

    #[Middleware('permission:editar pago')]
    public function update(UpdatePaymentRequest $request, Payment $pago)
    {
        $datos = $request->validated();
        $suscripcionAnteriorId = $pago->subscription_id;
        $nuevaSuscripcion = Subscription::findOrFail($datos['subscription_id']);

        $otrosPagos = Payment::where('subscription_id', $nuevaSuscripcion->id)
            ->where('id', '!=', $pago->id)
            ->sum('monto');

        $saldoPendiente = $nuevaSuscripcion->precio - $otrosPagos;

        if ($datos['monto'] > $saldoPendiente) {
            return back()->withErrors([
                'monto' => "El monto ($" . number_format($datos['monto'], 2) . ") supera el saldo restante de la suscripción ($" . number_format($saldoPendiente, 2) . ")."
            ]);
        }

        $pago->update($datos);

        if ($suscripcionAnteriorId !== $pago->subscription_id) {
            $subAnterior = Subscription::find($suscripcionAnteriorId);
            if ($subAnterior) {
                $pagadoAnterior = Payment::where('subscription_id', $subAnterior->id)->sum('monto');
                if ($pagadoAnterior < $subAnterior->precio) {
                    $subAnterior->update(['estado' => 'pendiente']);
                }
            }
        }

        $totalPagadoActual = $otrosPagos + $datos['monto'];
        if ($totalPagadoActual >= $nuevaSuscripcion->precio) {
            $nuevaSuscripcion->update(['estado' => 'activa']);
        } else {
            $nuevaSuscripcion->update(['estado' => 'pendiente']);
        }

        return redirect()->route('pagos.index')->with('success', 'Pago actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */

    #[Middleware('permission:eliminar pago')]
    public function destroy(Payment $pago)
    {
        $pago->delete();

        return redirect()->route('pagos.index')->with('success', 'Pago eliminado correctamente');
    }

    // !!! Faltaria la opcion de restaurar si el modelo de negocios asi lo permitiera
}
