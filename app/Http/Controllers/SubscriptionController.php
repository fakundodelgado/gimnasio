<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Client;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
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

        return Inertia::render('Suscripciones/Create', ['clientes' => $clientes, 'planes' => $planes]);
    }

    /**
     * Store a newly created resource in storage.
     */

    #[Middleware('permission:crear suscripcion')]
    public function store(StoreSubscriptionRequest $request)
    {

        DB::transaction(function () use ($request) {
            // 1. Crear la suscripción
            Subscription::create($request->validated());

            // 2. Cargar el plan asignado
            $plan = Plan::findOrFail($request->plan_id);

            // 3. Si el nuevo plan NO incluye entrenador, limpiamos la asignación del cliente
            if (!$plan->incluye_entrenador) {
                $client = Client::findOrFail($request->client_id);
                $client->update(['trainer_id' => null]);
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


        $clientes = Client::with('user:id,name')->get();

        $planes = Plan::all();

        $suscripcion->load(['client.user', 'plan']);

        return Inertia::render('Suscripciones/Edit', ['suscripcion' => $suscripcion, 'clientes' => $clientes, 'planes' => $planes]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Middleware('permission:editar suscripcion')]
    public function update(UpdateSubscriptionRequest $request, Subscription $suscripcion)
    {

        DB::transaction(function () use ($request, $suscripcion) {
            // 1. Actualizar la suscripción
            $suscripcion->update($request->validated());

            // 2. Obtener el cliente y evaluar su nueva suscripción activa
            $client = $suscripcion->client;
            $planActivo = $client->fresh()->activeSubscription?->plan;

            // 3. Si el nuevo plan no incluye entrenador (o venció/no existe), reseteamos
            if (!$planActivo || !$planActivo->incluye_entrenador) {
                $client->update(['trainer_id' => null]);
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
