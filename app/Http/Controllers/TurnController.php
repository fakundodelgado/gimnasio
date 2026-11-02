<?php

namespace App\Http\Controllers;

use App\Models\Turn;
use App\Models\Trainer;
use App\Models\Client;
use App\Http\Requests\StoreTurnRequest;
use App\Http\Requests\UpdateTurnRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TurnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        Gate::authorize('viewAny', Turn::class);

        $turnos = Turn::with(['client.user', 'trainer.employee.user'])->latest()->get();

        return Inertia::render('Turnos/Index', ['turnos' => $turnos]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Turn::class);

        $entrenadores = Trainer::with('employee.user')->latest()->get();

        $clientes = Client::with('user')->latest()->get();

        return Inertia::render('Turnos/Create', ['entrenadores' => $entrenadores, 'clientes' => $clientes]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTurnRequest $request)
    {

        Gate::authorize('create', Turn::class);

        Turn::create($request->validated());

        return redirect()->route('turnos.index')->with('success', 'Turno creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Turn $turno)
    {
        Gate::authorize('view', $turno);

        $turno->load(['trainer.employee.user', 'client.user']);

        return Inertia::render('Turnos/Show', ['turno' => $turno]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Turn $turno)
    {

        Gate::authorize('update', $turno);

        $entrenadores = Trainer::with('employee.user')->latest()->get();

        $clientes = Client::with('user')->latest()->get();

        $turno->load(['trainer.employee.user', 'client.user']);

        return Inertia::render('Turnos/Edit', ['entrenadores' => $entrenadores, 'clientes' => $clientes, 'turno' => $turno]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTurnRequest $request, Turn $turno)
    {
        Gate::authorize('update', $turno);

        $turno->update($request->validated());

        return redirect()->route('turnos.index')->with('success', 'Turno actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Turn $turno)
    {
        Gate::authorize('delete', $turno);

        $turno->delete();

        return redirect()->route('turnos.index')->with('success', 'Turno eliminado correctamente');
    }
}
