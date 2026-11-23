<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Client;
use App\Models\Trainer;
use App\Models\Employee;
use App\Models\Payment;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Middleware('permission:listar suscripciones')]
    public function index(Request $request)
    {

        $usuario = $request->user();
        $esAdmin = $usuario->hasAnyRole(['admin', 'super']);
        $esCliente = $usuario->hasRole('client');

        // Nombre, mail y telefono
        $datos = trim((string) $request->input('datos', '')); // Este campo buscara sobre datos personales
        // Id
        $id = trim((string)$request->input('id', ''));  // Este solo por id, si lo mesclo con otros campos con numero me termina devolviendo muchas filas innecesarias
        $orden = $request->input('orden', 'id');
        $papelera = $request->input('papelera', 'sin_eliminados');
        $direccion = $request->input('direccion', 'asc');
        $paginas = (int) $request->input('paginas', 5);
        $desde = trim((string) $request->input('desde', ''));
        $hasta = trim((string) $request->input('hasta', ''));
        $plan = trim((string) $request->input('plan', ''));
        $estado = trim((string) $request->input('estado', ''));

        $camposPermitidos = ['id', 'fecha_inicio', 'fecha_fin', 'precio'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'fecha_inicio';
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

        if ($plan !== '' && !ctype_digit($plan)) {
            $plan = '';
        }

        if (!in_array($estado, ['', 'activa', 'pendiente', 'vencida', 'cancelada'], true)) {
            $estado = '';
        }

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
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

        $query = Subscription::with([
            'client' => fn($q) => $q->withTrashed()->with((['user' => fn($q) => $q->withTrashed()])),
            'plan' => fn($q) => $q->withTrashed(),
            'payments' => fn($q) => $q->with(['employee' => fn($q2) => $q2->withTrashed()->with((['user' => fn($q3) => $q3->withTrashed()]))]),
        ]);

        $query->when($papelera === 'con_eliminados', function ($q) {
            $q->withTrashed();
        });

        // Recien ahora se me ocurre usar funciones flecha
        $query->when($papelera === 'solo_eliminados', fn($q) => $q->onlyTrashed());

        $query->when($desde !== '', function ($q) use ($desde) {
            $q->whereDate('fecha_inicio', '>=', $desde);
        });

        $query->when($hasta !== '', function ($q) use ($hasta) {
            $q->whereDate('fecha_inicio', '<=', $hasta);
        });

        $query->when(!$esCliente && $datos !== '', function ($q) use ($datos) {
            $q->whereHas('client', function ($clientQ) use ($datos) {
                $clientQ->withTrashed()->where(function ($subQ) use ($datos) {
                    $subQ->where('clients.telefono', 'like', "%{$datos}%")
                        ->orWhereHas('user', function ($userQ) use ($datos) {
                            $userQ->withTrashed()->where(function ($uSubQ) use ($datos) {
                                $uSubQ->where('users.name', 'like', "%{$datos}%")
                                    ->orWhere('users.email', 'like', "%{$datos}%");
                            });
                        });
                });
            });
        });

        $query->when($id !== '', fn($q) => $q->where('subscriptions.id', $id));

        $query->when($esCliente, fn($q) => $q->where('subscriptions.client_id', $usuario->client?->id));

        $query->when($plan !== '', fn($q) => $q->where('subscriptions.plan_id', $plan));

        $query->when($estado !== '', fn($q) => $q->where('subscriptions.estado', $estado));

        $query->orderBy("subscriptions.{$orden}", $direccion)
            ->orderBy('subscriptions.id', 'desc');

        $suscripciones = $query->paginate($paginas)->withQueryString();

        $planes = Plan::withTrashed()->get(['id', 'nombre']);

        return Inertia::render('Suscripciones/Index', [
            'suscripciones' => $suscripciones,
            'planes'        => $planes,
            'filtros'       => [
                'datos'     => $datos,
                'id'        => $id,
                'orden'     => $orden,
                'papelera'  => $papelera,
                'direccion' => $direccion,
                'paginas'   => $paginas,
                'desde'     => $desde,
                'hasta'     => $hasta,
                'plan'      => $plan,
                'estado'    => $estado,
            ],
            'esAdmin'   => $esAdmin,
            'esCliente' => $esCliente,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Middleware('permission:crear suscripcion')]
    public function create()
    {
        $clientes = Client::with('user:id,name')->get();

        $planes = Plan::all();

        $inicio = Carbon::today()->toDateString();

        // Necesito saber cuantos alumnos tienen
        $entrenadores = Trainer::with('employee.user')
            ->withCount(['clients' => function ($query) {
                $query->whereHas('subscriptions', function ($q) {
                    $q->where('estado', 'activa');
                });
            }])
            ->get();

        return Inertia::render('Suscripciones/Create', ['clientes' => $clientes, 'planes' => $planes, 'inicio' => $inicio, 'entrenadores' => $entrenadores]);
    }

    /**
     * Store a newly created resource in storage.
     */

    #[Middleware('permission:crear suscripcion')]
    public function store(StoreSubscriptionRequest $request)
    {

        $datos = $request->validated();

        $fechaInicio = Carbon::today();
        $plan = Plan::findOrFail($datos['plan_id']);
        $fechaFin = $fechaInicio->copy()->addDays($plan->duracion);

        $datos['fecha_fin'] = $fechaFin->toDateString();
        $datos['fecha_inicio'] = $fechaInicio->toDateString();

        if (!$plan->incluye_entrenador) {
            $datos['trainer_id'] = null;
        }

        if (!empty($datos['trainer_id'])) {
            $entrenador = Trainer::withCount(['clients' => function ($q) {
                $q->whereHas('subscriptions', fn($sub) => $sub->where('estado', 'activa'));
            }])->findOrFail($datos['trainer_id']);

            if ($entrenador->clients_count >= $entrenador->limite_alumnos) {
                return back()->withErrors([
                    'trainer_id' => 'El entrenador seleccionado ya no tiene cupo disponible.'
                ]);
            }
        }

        DB::transaction(function () use ($datos, $plan) {

            $cliente = Client::findOrFail($datos['client_id']);

            $ultima = $cliente->ultimaSuscripcion()->first();

            // Compruebo el estado de la ultima suscripcion, solo puede haber una activa o pendiente, dependiendo del estado inicial puedo cambiarla o no
            if ($ultima && in_array($ultima->estado, ['activa', 'pendiente'], true)) {
                if ($ultima->fecha_fin < Carbon::today()) {
                    $ultima->update(['estado' => 'vencida']);
                } else {
                    $ultima->update(['estado' => 'cancelada', 'fecha_fin' => Carbon::today()]);
                }
            }

            //$suscripcion->update(['estado' => 'vencida', 'fecha_fin' => Carbon::today()]);

            $datos['precio'] = $plan->precio;

            $nueva = Subscription::create($datos);

            $monto = $datos['estado'] === 'activa' ? $plan->precio : round($plan->precio / 2, 2);

            if (auth()->user()->hasAnyRole(['admin', 'super'])) {
                $empleado = Employee::where('cuil', '27389998889')->firstOrFail();
            } else {
                $empleado = auth()->user()->employee()->first();
            }

            Payment::create(['employee_id' => $empleado->id, 'monto' => $monto, 'fecha_pago' => Carbon::today(), 'subscription_id' => $nueva->id, 'metodo_pago' => $datos['metodo_pago']]);

            if (!$plan->incluye_entrenador) {
                $cliente->update(['trainer_id' => null]);
            } else {
                $cliente->update(['trainer_id' => $datos['trainer_id']]);
            }
        });

        return redirect()->route('suscripciones.index')->with('success', 'Suscripcion creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    #[Middleware('permission:mostrar suscripcion')]
    public function show(Subscription $suscripcion)
    {

        // Podria pasarle info sobre los pagos asociados a la suscripción, pero por ahora no, centrarse en lo elemental.

        $suscripcion->load(['client.user', 'plan']);

        return Inertia::render('Suscripciones/Show', ['suscripcion' => $suscripcion]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Middleware('permission:editar suscripcion')]
    public function edit(Subscription $suscripcion)
    {
        $suscripcion->load('client');

        $suscripcion->trainer_id = $suscripcion->client?->trainer_id;

        $clientes = Client::with('user:id,name,email')->get();

        $planes = Plan::all();

        $entrenadores = Trainer::with('employee.user')
            ->withCount(['clients' => function ($query) {
                $query->whereHas('subscriptions', function ($q) {
                    $q->where('estado', 'activa');
                });
            }])
            ->get();

        return Inertia::render('Suscripciones/Edit', [
            'suscripcion'  => $suscripcion,
            'clientes'     => $clientes,
            'planes'       => $planes,
            'entrenadores' => $entrenadores,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Middleware('permission:editar suscripcion')]
    public function update(UpdateSubscriptionRequest $request, Subscription $suscripcion)
    {

        $datos = $request->validated();

        if ((int) $datos['plan_id'] !== (int) $suscripcion->plan_id && $suscripcion->payments()->exists()) {
            return back()->withErrors([
                'plan_id' => 'No se puede cambiar el plan de una suscripción que ya tiene pagos registrados. Creá una nueva suscripción para reemplazarla.'
            ]);
        }

        $plan = Plan::findOrFail($datos['plan_id']);

        if (!$plan->incluye_entrenador) {
            $datos['trainer_id'] = null;
        }

        if (!empty($datos['trainer_id'])) {

            if ((int) $datos['trainer_id'] !== (int) $suscripcion->client?->trainer_id) {
                $entrenador = Trainer::withCount(['clients' => function ($q) {
                    $q->whereHas('subscriptions', fn($sub) => $sub->where('estado', 'activa'));
                }])->findOrFail($datos['trainer_id']);

                if ($entrenador->clients_count >= $entrenador->limite_alumnos) {
                    return back()->withErrors([
                        'trainer_id' => 'El entrenador seleccionado ya no tiene cupo disponible.'
                    ]);
                }
            }
        }

        if (isset($datos['fecha_inicio'])) {
            $fechaInicio = Carbon::parse($datos['fecha_inicio']);
            $datos['fecha_fin'] = $fechaInicio->copy()->addDays($plan->duracion)->toDateString();
        }

        DB::transaction(function () use ($suscripcion, $datos, $plan) {
            $suscripcion->update($datos);

            $client = Client::findOrFail($suscripcion->client_id);

            if (!$plan->incluye_entrenador) {
                $client->update(['trainer_id' => null]);
            } else {
                $client->update(['trainer_id' => $datos['trainer_id']]);
            }
        });

        return redirect()->route('suscripciones.index')->with('success', 'Suscipcion actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */

    #[Middleware('permission:eliminar suscripcion')]
    public function destroy(Subscription $suscripcion)
    {

        DB::transaction(function () use ($suscripcion) {
            $cliente = $suscripcion->client;

            if ($cliente && $cliente->trainer_id !== null && in_array($suscripcion->estado, ['activa', 'pendiente'])) {
                $cliente->update(['trainer_id' => null]);
            }

            // Borramos también los pagos asociados a esta suscripción errónea
            $suscripcion->payments()->delete();

            $suscripcion->update([
                'estado'    => 'cancelada',
                'fecha_fin' => Carbon::today(),
            ]);

            $suscripcion->delete();
        });

        return redirect()->route('suscripciones.index')->with('success', 'Suscripcion eliminada correctamente.');
    }

    #[Middleware('permission:restaurar suscripcion')] // o el permiso que uses
    public function restore(Subscription $suscripcion)
    {
        DB::transaction(function () use ($suscripcion) {
            $suscripcion->restore();
            // Restauramos los pagos que se habían borrado con ella
            $suscripcion->payments()->withTrashed()->restore();

            $suscripcion->load('payments');

            // Recalculamos si debe volver a quedar activa, pendiente o vencida según la fecha actual
            $suscripcion->recalcularEstado();
        });

        return redirect()->route('suscripciones.index')->with('success', 'Suscripción restaurada correctamente.');
    }

    #[Middleware('permission:editar suscripcion')]
    public function actualizarEstados()
    {
        $cantidad = Subscription::actualizarEstados();

        return redirect()->back()->with(
            'success',
            "Estados actualizados correctamente ({$cantidad} suscripciones modificadas)."
        );
    }
}
