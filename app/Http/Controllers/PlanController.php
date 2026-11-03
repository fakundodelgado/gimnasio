<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;


class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        Gate::authorize('viewAny', Plan::class);

        // Parametros de entrada para mis filtros
        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        // Campos o entradas validas
        $camposPermitidos = ['id', 'nombre', 'precio', 'duracion'];

        // Establezco valores por defecto ante entradas no validas

        // Si no aprieto nada entonces estara ordenado por id 
        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        // Se manejara con las flechitas al lado de cada columna
        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        // En principio seran solo 5 páginas a no ser que modifique dicho valor
        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $query = Plan::query();

        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        $query->when($buscar !== '', function ($q) use ($buscar) {
            $q->where(function ($subQ) use ($buscar) {

                if (is_numeric($buscar)) {
                    $subQ->where('plans.id', $buscar);
                }

                $subQ->orWhere('plans.nombre', 'like', "%{$buscar}%");
            });
        });

        $query->orderBy("plans.{$orden}", $direccion);

        $planes = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Planes/Index', [
            'planes' => $planes,
            'filtros' => [
                'buscar'     => $buscar,
                'orden'      => $orden,
                'direccion'  => $direccion,
                'por_pagina' => $porPagina,
                'papelera'   => $papelera,
            ],
        ]);
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
