<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use App\Http\Requests\StoreTrainerRequest;
use App\Http\Requests\UpdateTrainerRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Trainer::class);

        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        $camposPermitidos = ['id', 'nombre', 'especialidad', 'cuil'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $query = Trainer::with([
            'employee' => function ($empQuery) {
                $empQuery->withTrashed()->with([
                    'user' => function ($userQuery) {
                        $userQuery->withTrashed();
                    }
                ]);
            }
        ]);

        // Papelera (Exclusivo Admin / Super Admin)
        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        // Búsqueda por N° Socio (ID) o por Nombre/Email en la relación User
        $query->when($buscar !== '', function ($q) use ($buscar) {
            $q->where(function ($subQ) use ($buscar) {

                // 1. ID exacto del Trainer si es numérico
                if (is_numeric($buscar)) {
                    $subQ->where('trainers.id', $buscar);
                }

                // 2. Especialidad en la tabla trainers
                $subQ->orWhere('trainers.especialidad', 'like', "%{$buscar}%");

                // 3. Buscar por CUIL en la relación Employee (incluyendo eliminados)
                $subQ->orWhereHas('employee', function ($empQuery) use ($buscar) {
                    $empQuery->withTrashed()
                        ->where('cuil', 'like', "%{$buscar}%");
                });

                // 4. Buscar por Nombre/Email en Employee -> User (incluyendo eliminados en ambos niveles)
                $subQ->orWhereHas('employee', function ($empQuery) use ($buscar) {
                    $empQuery->withTrashed()
                        ->whereHas('user', function ($uQuery) use ($buscar) {
                            $uQuery->withTrashed()
                                ->where(function ($q2) use ($buscar) {
                                    $q2->where('name', 'like', "%{$buscar}%")
                                        ->orWhere('email', 'like', "%{$buscar}%");
                                });
                        });
                });
            });
        });

        if ($orden === 'nombre') {
            $query->join('employees', 'trainers.employee_id', '=', 'employees.id')
                ->join('users', 'employees.user_id', '=', 'users.id')
                ->orderBy('users.name', $direccion)
                ->select('trainers.*');
        } elseif ($orden === 'cuil') {
            $query->join('employees', 'trainers.employee_id', '=', 'employees.id')
                ->orderBy('employees.cuil', $direccion)
                ->select('trainers.*');
        } else {
            $query->orderBy("trainers.{$orden}", $direccion)
                ->select('trainers.*');
        }

        $entrenadores = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Entrenadores/Index', [
            'entrenadores' => $entrenadores,
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

        Gate::authorize('create', Trainer::class);

        return Inertia::render('Entrenadores/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTrainerRequest $request, UserService $userService, EmployeeService $employeeService)
    {
        Gate::authorize('create', Trainer::class);

        DB::transaction(function () use ($request, $userService, $employeeService) {

            $user = $userService->createUser($request->validated(), 'trainer');

            $employee = $employeeService->createEmployee($user->id, $request->validated());

            $employee->trainer()->create([
                'especialidad' => $request->especialidad,
            ]);
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Trainer $entrenador)
    {
        Gate::authorize('view', $entrenador);

        $entrenador->load('employee.user');

        return Inertia::render('Entrenadores/Show', ['entrenador' => $entrenador]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trainer $entrenador)
    {
        Gate::authorize('update', $entrenador);

        $entrenador->load('employee.user');

        return Inertia::render('Entrenadores/Edit', ['entrenador' => $entrenador]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTrainerRequest $request, Trainer $entrenador, UserService $userService, EmployeeService $employeeService)
    {
        Gate::authorize('update', $entrenador);

        DB::transaction(function () use ($request, $entrenador, $userService, $employeeService) {

            $user = $entrenador->employee->user;
            $empleado = $entrenador->employee;

            $userService->updateUser($user, $request->validated());
            $employeeService->updateEmployee($empleado, $request->validated());

            $entrenador->update([
                'especialidad' => $request->especialidad
            ]);
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trainer $entrenador, UserService $userService, EmployeeService $employeeService)
    {
        Gate::authorize('delete', $entrenador);

        DB::transaction(function () use ($entrenador, $userService, $employeeService) {

            $user = $entrenador->employee->user;
            $empleado = $entrenador->employee;

            $entrenador->delete();

            $employeeService->deleteEmployee($empleado);

            $userService->deleteUser($user);
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador eliminado correctamente.');
    }
}
