<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Employee::class);

        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        $camposPermitidos = ['id', 'nombre', 'cuil', 'created_at'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $query = Employee::with(['user' => function ($q) {
            $q->withTrashed(); // Carga la relación user incluso si sufrió Soft Delete
        }]);

        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        // Búsqueda por N° Socio (ID) o por Nombre/Email en la relación User
        $query->when($buscar !== '', function ($q) use ($buscar) {
            $q->where(function ($subQ) use ($buscar) {
                if (is_numeric($buscar)) {
                    $subQ->where('employees.id', $buscar);
                }

                $subQ->orWhere('employees.cuil', 'like', "%{$buscar}%");

                $subQ->orWhereHas('user', function ($userQuery) use ($buscar) {
                    $userQuery->withTrashed()
                        ->where(function ($uQ) use ($buscar) {
                            $uQ->where('name', 'like', "%{$buscar}%")
                                ->orWhere('email', 'like', "%{$buscar}%");
                        });
                });
            });
        });

        if ($orden === 'nombre') {
            $query->join('users', 'employees.user_id', '=', 'users.id')
                ->orderBy('users.name', $direccion)
                ->select('employees.*'); // Retorna únicamente campos del modelo Client
        } else {
            $query->orderBy("employees.{$orden}", $direccion)
                ->select('employees.*');
        }

        $empleados = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
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
        Gate::authorize('create', Employee::class);

        return Inertia::render('Empleados/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request, EmployeeService $employeeService, UserService $userService)
    {
        Gate::authorize('create', Employee::class);

        DB::transaction(function () use ($request, $employeeService, $userService) {

            $user = $userService->createUser($request->validated(), 'employee');

            $employeeService->createEmployee($user->id, $request->validated());
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $empleado)
    {

        Gate::authorize('view', $empleado);

        $empleado->load('user');

        return Inertia::render('Empleados/Show', ['empleado' => $empleado]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $empleado)
    {
        Gate::authorize('update', $empleado);

        // traigo los datos del user asociado al usuario
        $empleado->load('user');

        return Inertia::render('Empleados/Edit', ['empleado' => $empleado]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEmployeeRequest $request, Employee $empleado, UserService $userService, EmployeeService $employeeService)
    {
        Gate::authorize('update', $empleado);

        DB::transaction(function () use ($request, $empleado, $userService, $employeeService) {

            $userService->updateUser($empleado->user, $request->validated());

            $employeeService->updateEmployee($empleado, $request->validated());
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $empleado, UserService $userService, EmployeeService $employeeService)
    {

        Gate::authorize('delete', $empleado);

        DB::transaction(function () use ($empleado, $employeeService, $userService) {

            $user = $empleado->user;

            $employeeService->deleteEmployee($empleado);

            $userService->deleteUser($user);
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado eliminado correctamente.');
    }
}
