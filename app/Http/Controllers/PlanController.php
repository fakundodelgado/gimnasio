<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;


class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        Gate::authorize('viewAny', Plan::class);

        // Por ahora devuelvo todo, pero en un futuro deberia de filtrar
        $planes = Plan::withCount('subscriptions')->latest()->get();

        return Inertia::render('Planes/Index', ['planes' => $planes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Plan::class);

        return Inertia::render('Planes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlanRequest $request)
    {

        Gate::authorize('create', Plan::class);

        $validados = $request->validated();

        Plan::create($validados);

        return redirect()->route('planes.index')->with('success', 'plan creado correctamente.');

    }

    /**
     * Display the specified resource.
     */
    public function show(Plan $plan)
    {
        Gate::authorize('view', $plan);

        $plan->loadCount('subscriptions');

        return Inertia::render('Planes/Show', ['plan' => $plan]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plan $plan)
    {
        Gate::authorize('update', $plan);

         return Inertia::render('Planes/Edit', ['plan' => $plan]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        Gate::authorize('update', $plan);

        $validados = $request->validated();

        $plan->update($validados);

        return redirect()->route('planes.index')->with('success', 'plan actualizado correctamente.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plan $plan)
    {

        Gate::authorize('delete', $plan); 

        $plan->delete();

        return redirect()->route('planes.index')->with('success', 'plan "eliminado" correctamente.');

    }
}
