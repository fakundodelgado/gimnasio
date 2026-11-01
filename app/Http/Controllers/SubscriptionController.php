<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Client;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UpdateSubscriptionRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Se debe controlar que el cliente solo pueda ver sus suscripciones...
        Gate::authorize('viewAny', Subscription::class);

        $suscripciones = Subscription::with(['client.user', 'plan'])->latest()->get();

        return Inertia::render('Suscripciones/Index', ['suscripciones' => $suscripciones]);

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
