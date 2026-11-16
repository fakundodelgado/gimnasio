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
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\PagosExport;
use Maatwebsite\Excel\Facades\Excel;


class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Middleware('permission:listar pagos')]
    public function index(Request $request)
    {
        [$query, $filtros, $esAdmin, $esCliente] = $this->filtrarPagos($request);

        return Inertia::render('Pagos/Index', [
            'pagos'     => $query->paginate($filtros['paginas'])->withQueryString(),
            'filtros'   => $filtros,
            'esAdmin'   => $esAdmin,
            'esCliente' => $esCliente,
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

    // Dado que los datos son generados puede que las fechas y los IDs no sean demasiado coherentes, por ejemplo
    // puede suceder que el primer pago sea de hace un dia y el ultimo de hace un mes, lo que en teoria carece de sentido.
    public function pdf(Request $request)
    {
        [$query, $filtros, $esAdmin] = $this->filtrarPagos($request);

        $pdf = Pdf::loadView('pdfs.pagos.pagos', [
            'pagos'   => $query->get(),
            'filtros' => $filtros,
            'esAdmin' => $esAdmin,
        ]);

        return $pdf->download('resumen_pagos.pdf');
    }

    public function export(Request $request)
    {
        [$query,, $esAdmin] = $this->filtrarPagos($request);

        return Excel::download(
            new PagosExport($query, $esAdmin),
            'reporte_pagos.xlsx'
        );
    }

    private function filtrarPagos(Request $request): array
    {
        $usuario = $request->user();
        $esAdmin = $usuario->hasAnyRole(['admin', 'super']);
        $esCliente = $usuario->hasRole('client');

        $datos = trim($request->input('datos', ''));
        $empleado = trim($request->input('empleado', ''));
        $id = trim($request->input('id', ''));
        $suscripcion = trim($request->input('suscripcion', ''));
        $metodo = trim($request->input('metodo', ''));
        $desde = trim($request->input('desde', ''));
        $hasta = trim($request->input('hasta', ''));
        $orden = $request->input('orden', '');
        $papelera = $request->input('papelera', '');
        $direccion = $request->input('direccion', '');
        $paginas = (int) $request->input('paginas', 5);

        $camposPermitidos = ['id', 'fecha_pago', 'monto', 'metodo_pago'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'fecha_pago';
        }
        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }
        if (!in_array($paginas, [5, 10, 20], true)) {
            $paginas = 5;
        }
        if ($id !== '' && !ctype_digit($id)) {
            $id = '';
        }
        if ($suscripcion !== '' && !ctype_digit($suscripcion)) {
            $suscripcion = '';
        }
        if (!in_array($metodo, ['', 'efectivo', 'transferencia', 'tarjeta'], true)) {
            $metodo = '';
        }
        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
            $empleado = '';
        }
        if (!in_array($papelera, ['sin_eliminados', 'solo_eliminados', 'con_eliminados'], true)) {
            $papelera = 'sin_eliminados';
        }
        if ($desde !== '' && !\DateTime::createFromFormat('Y-m-d', $desde)) {
            $desde = '';
        }
        if ($hasta !== '' && !\DateTime::createFromFormat('Y-m-d', $hasta)) {
            $hasta = '';
        }

        $query = Payment::with([
            'subscription' => fn($q) => $q->withTrashed()->with([
                'client' => fn($cq) => $cq->withTrashed()->with([
                    'user' => fn($uq) => $uq->withTrashed(),
                ]),
                'plan' => fn($pq) => $pq->withTrashed(),
            ]),
            'employee' => fn($q) => $q->withTrashed()->with([
                'user' => fn($uq) => $uq->withTrashed(),
            ]),
        ]);

        $query->when($papelera === 'con_eliminados', fn($q) => $q->withTrashed());
        $query->when($papelera === 'solo_eliminados', fn($q) => $q->onlyTrashed());
        $query->when($desde !== '', fn($q) => $q->whereDate('payments.fecha_pago', '>=', $desde));
        $query->when($hasta !== '', fn($q) => $q->whereDate('payments.fecha_pago', '<=', $hasta));

        $query->when(!$esCliente && $datos !== '', function ($q) use ($datos) {
            $q->whereHas('subscription', function ($subQ) use ($datos) {
                $subQ->withTrashed()->whereHas('client', function ($clientQ) use ($datos) {
                    $clientQ->withTrashed()->where(function ($cSubQ) use ($datos) {
                        $cSubQ->where('clients.telefono', 'like', "%{$datos}%")
                            ->orWhereHas('user', function ($userQ) use ($datos) {
                                $userQ->withTrashed()->where(function ($uSubQ) use ($datos) {
                                    $uSubQ->where('users.name', 'like', "%{$datos}%")
                                        ->orWhere('users.email', 'like', "%{$datos}%");
                                });
                            });
                    });
                });
            });
        });

        $query->when($esAdmin && $empleado !== '', function ($q) use ($empleado) {
            $q->whereHas('employee', function ($empQ) use ($empleado) {
                $empQ->withTrashed()->where(function ($eSubQ) use ($empleado) {
                    $eSubQ->where('employees.cuil', 'like', "%{$empleado}%")
                        ->orWhereHas('user', function ($userQ) use ($empleado) {
                            $userQ->withTrashed()->where('users.name', 'like', "%{$empleado}%");
                        });
                });
            });
        });

        $query->when($id !== '', fn($q) => $q->where('payments.id', $id));
        $query->when($suscripcion !== '', fn($q) => $q->where('payments.subscription_id', $suscripcion));
        $query->when($metodo !== '', fn($q) => $q->where('payments.metodo_pago', $metodo));

        $query->when($esCliente, function ($q) use ($usuario) {
            $q->whereHas('subscription', function ($subQ) use ($usuario) {
                $subQ->withTrashed()->where('subscriptions.client_id', $usuario->client?->id);
            });
        });

        $query->orderBy("payments.{$orden}", $direccion)
            ->orderBy('payments.id', 'desc');

        $filtros = [
            'datos'       => $datos,
            'empleado'    => $empleado,
            'id'          => $id,
            'suscripcion' => $suscripcion,
            'metodo'      => $metodo,
            'desde'       => $desde,
            'hasta'       => $hasta,
            'orden'       => $orden,
            'papelera'    => $papelera,
            'direccion'   => $direccion,
            'paginas'     => $paginas,
        ];

        return [$query, $filtros, $esAdmin, $esCliente];
    }
}
