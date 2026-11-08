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
        // Parametros por lo cuales voy a filtrar
        $buscar = trim($request->input('buscar', ''));
        $estado = $request->input('estado', '');
        $orden = $request->input('orden', 'fecha_inicio');
        $direccion = $request->input('direccion', 'desc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        // Compruebo que los valores sean validos
        $camposPermitidos = ['id', 'fecha_inicio', 'fecha_fin', 'precio', 'estado'];
        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'fecha_inicio';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        // Lo que fue borrado de forma logica solo estara disponible para el admin o super(administrador)
        $user = $request->user();

        $esAdmin = $user->hasRole(['admin', 'super']); // Ve todo incluso las que sufrieron un softdelete
        $esCliente = $user->hasRole('client'); // Solo ve sus suscripciones

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        $suscripciones = Subscription::with(['client.user', 'plan'])
            // Papelera 
            ->when($esAdmin && $papelera === 'solo_eliminados', function ($query) {
                $query->onlyTrashed();
            })
            ->when($esAdmin && $papelera === 'todos', function ($query) {
                $query->withTrashed();
            })
            // Si es cliente, solo ve sus propias suscripciones
            ->when($esCliente && $user->client, function ($query) use ($user) {
                $query->where('client_id', $user->client->id);
            })
            // Búsqueda por Nombre de Cliente o N° Suscripción (ID)
            ->when($buscar !== '', function ($query) use ($buscar) {
                $query->where(function ($q) use ($buscar) {
                    if (is_numeric($buscar)) {
                        $q->where('id', $buscar);
                    }
                    $q->orWhereHas('client.user', function ($userQuery) use ($buscar) {
                        $userQuery->where('name', 'like', "%{$buscar}%");
                    });
                });
            })
            // Filtro por Estado
            ->when($request->filled('estado'), function ($query) use ($estado) {
                $query->where('estado', $estado);
            })
            ->orderBy($orden, $direccion)
            ->paginate($porPagina)
            ->withQueryString();

        // Le paso el resultado de la consulta y todos los filtros
        return Inertia::render('Suscripciones/Index', [
            'suscripciones' => $suscripciones,
            'filtros' => [
                'buscar'     => $buscar,
                'estado'     => $estado,
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
