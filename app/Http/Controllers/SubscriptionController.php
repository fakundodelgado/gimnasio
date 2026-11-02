<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Client;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Se debe controlar que el cliente solo pueda ver sus suscripciones...
        Gate::authorize('viewAny', Subscription::class);

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
    public function create()
    {
        Gate::authorize('create', Subscription::class);

        $clientes = Client::with('user:id,name')->get();

        $planes = Plan::all();

        return Inertia::render('Suscripciones/Create', ['clientes' => $clientes, 'planes' => $planes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSubscriptionRequest $request)
    {

        Gate::authorize('create', Subscription::class);

        Subscription::create($request->validated());

        return redirect()->route('suscripciones.index')->with('success', 'Suscripcion creada correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Subscription $suscripcion)
    {
        Gate::authorize('view', $suscripcion);

        $suscripcion->load(['client.user', 'plan']);

        return Inertia::render('Suscripciones/Show', ['suscripcion' => $suscripcion]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Subscription $suscripcion)
    {
        Gate::authorize('update', $suscripcion);

        $clientes = Client::with('user:id,name')->get();

        $planes = Plan::all();

        $suscripcion->load(['client.user', 'plan']);

        return Inertia::render('Suscripciones/Edit', ['suscripcion' => $suscripcion, 'clientes' => $clientes, 'planes' => $planes]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSubscriptionRequest $request, Subscription $suscripcion)
    {
        Gate::authorize('update', $suscripcion);

        $suscripcion->update($request->validated());

        return redirect()->route('suscripciones.index')->with('success', 'Suscipcion actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Subscription $suscripcion)
    {
        Gate::authorize('delete', $suscripcion);

        $suscripcion->delete();

        return redirect()->route('suscripciones.index')->with('success', 'Suscripcion eliminada correctamente.');
    }
}
