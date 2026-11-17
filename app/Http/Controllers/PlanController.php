<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Http\Requests\StorePlanRequest;
use App\Http\Requests\UpdatePlanRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;


class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    #[Middleware('permission:listar planes')]
    public function index(Request $request)
    {

        // Entradas para los filtros
        $esAdmin = $request->user()->hasAnyRole(['admin', 'super']);

        $buscar = trim((string) $request->input('buscar', ''));
        $incluyeEntrenador = trim((string) $request->input('incluye_entrenador', ''));
        $orden = $request->input('orden', 'id');
        $paginas = (int) $request->input('paginas', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');
        $direccion = $request->input('direccion', 'asc');
        // Si pusiera un valor por defecto evitaria que el usaurio pueda ver todos los planes en un principio
        $duracion = trim((string)$request->input('duracion', ''));

        $camposPermitidos = ['duracion', 'nombre', 'precio', 'id'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($paginas, [5, 10, 20], true)) {
            $paginas = 5;
        }

        if (!$request->user()->hasAnyRole(['admin', 'super'])) {
            $papelera = 'sin_eliminados';
        }

        if (!in_array($papelera, ['sin_eliminados', 'solo_eliminados', 'con_eliminados'], true)) {
            $papelera = 'sin_eliminados';
        }

        $query = Plan::query();

        // Papelera
        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        });

        $query->when($papelera === 'con_eliminados', function ($q) {
            $q->withTrashed();
        });

        /* Si papelera es sin_eliminados entonces no hay nada que aplicar, los when se ejecutaran uno a uno */

        // Entrenador

        /*
            En este caso el verdadero y falso seran 0 y 1, algo como lo que sucede en C. Al parecer esto es más un tema sobre como MySQL define las columnas que laravel trata
            como boolean si entramos a phpMyAdmin y vemos como esta definido el tipo de dato de esa columna se ve que es tinyint osea (0,1).
        */

        $query->when(in_array($incluyeEntrenador, ['0', '1'], true), function ($q) use ($incluyeEntrenador) {
            $q->where('plans.incluye_entrenador', (int) $incluyeEntrenador);
        });

        // Duracion
        $query->when($duracion !== '' && is_numeric($duracion), function ($q) use ($duracion) {
            $q->where('plans.duracion', $duracion);
        });


        $query->when($buscar !== '', function ($q) use ($buscar) {
            $q->where('plans.nombre', 'like', "%{$buscar}%");
        });

        $query->orderBy("plans.{$orden}", $direccion)->orderBy('id', 'asc');

        $planes = $query->paginate($paginas)->withQueryString();

        // Necesito las duraciones para un desplegable
        $duraciones = Plan::select('plans.duracion')->orderBy('duracion')->distinct()->pluck('duracion');

        return Inertia::render('Planes/Index', [
            'planes' => $planes,
            'duraciones' => $duraciones,
            'filtros' => [
                'buscar' => $buscar,
                'paginas' => $paginas,
                'orden' => $orden,
                'direccion' => $direccion,
                'papelera' => $papelera,
                'incluye_entrenador' => $incluyeEntrenador,
                'duracion' => $duracion
            ],
            'esAdmin' => $esAdmin
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    #[Middleware('permission:crear plan')]
    public function create()
    {
        return Inertia::render('Planes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Middleware('permission:crear plan')]
    public function store(StorePlanRequest $request)
    {

        $validados = $request->validated();

        Plan::create($validados);

        return redirect()->route('planes.index')->with('success', 'plan creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    #[Middleware('permission:mostrar plan')]
    public function show(Plan $plan)
    {
        $plan->loadCount('subscriptions');

        return Inertia::render('Planes/Show', ['plan' => $plan]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Middleware('permission:editar plan')]
    public function edit(Plan $plan)
    {
        return Inertia::render('Planes/Edit', ['plan' => $plan]);
    }

    /**
     * Update the specified resource in storage.
     */
    #[Middleware('permission:editar plan')]
    public function update(UpdatePlanRequest $request, Plan $plan)
    {
        $validados = $request->validated();

        $plan->update($validados);

        return redirect()->route('planes.index')->with('success', 'plan actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    #[Middleware('permission:eliminar plan')]
    public function destroy(Plan $plan)
    {
        $plan->delete();

        return redirect()->route('planes.index')->with('success', 'plan "eliminado" correctamente.');
    }

    // !!! De ser necesario habria que incluir el restore
}
