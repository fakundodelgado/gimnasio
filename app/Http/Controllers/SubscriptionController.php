<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Client;
use App\Models\Trainer;
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
        $datos = trim($request->input('datos', '')); // Este campo buscara sobre datos personales
        // Id
        $id = trim($request->input('id', ''));  // Este solo por id, si lo mesclo con otros campos con numero me termina devolviendo muchas filas innecesarias
        $orden = $request->input('orden', '');
        $papelera = $request->input('papelera', '');
        $direccion = $request->input('direccion', '');
        $paginas = (int) $request->input('paginas', 5);
        $desde = trim($request->input('desde', ''));
        $hasta = trim($request->input('hasta', ''));
        $plan = trim($request->input('plan', ''));
        $estado = trim($request->input('estado', ''));

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

            Subscription::create($datos);

            $client = Client::findOrFail($datos['client_id']);

            if (!$plan->incluye_entrenador) {
                $client->update(['trainer_id' => null]);
            } else {
                $client->update(['trainer_id' => $datos['trainer_id']]);
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

        $plan = Plan::findOrFail($datos['plan_id']);

        if (!$plan->incluye_entrenador) {
            $datos['trainer_id'] = null;
        }

        if (!empty($datos['trainer_id'])) {

            if ((int) $datos['trainer_id'] !== (int) $suscripcion->trainer_id) {
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
            $client = $suscripcion->client;

            // 1. Eliminar (o soft delete) la suscripción
            $suscripcion->delete();

            // 2. Verificar si al eliminarla le queda alguna OTRA suscripción activa vigente
            $planActivo = $client->fresh()->activeSubscription?->plan;

            // Si ya no tiene plan activo o el que tiene no incluye entrenador, limpiamos
            if (!$planActivo || !$planActivo->incluye_entrenador) {
                $client->update(['trainer_id' => null]);
            }
        });

        return redirect()->route('suscripciones.index')->with('success', 'Suscripcion eliminada correctamente.');
    }

    // !!! Restore...
}
