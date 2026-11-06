<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    #[Middleware('permission:listar empleados')]
    public function index(Request $request)
    {

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

        // Busca por ID o por Nombre, Email (Tengo que modificarlo, no funciona adecuadamente)
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
                ->select('employees.*'); // Retorna solo los datos del empleado pero usa el name de user para ordenar
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

    #[Middleware('permission:crear empleado')]
    public function create()
    {
        return Inertia::render('Empleados/Create');
    }

    /**
     * Store a newly created resource in storage.
     */

    #[Middleware('permission:crear empleado')]
    public function store(StoreEmployeeRequest $request, EmployeeService $employeeService, UserService $userService)
    {

        DB::transaction(function () use ($request, $employeeService, $userService) {

            $user = $userService->createUser($request->validated(), 'employee');

            $employeeService->createEmployee($user->id, $request->validated());
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado creado correctamente.');
    }

    /**
     * Display the specified resource.
     */

    #[Middleware('permission:mostrar empleado')]
    public function show(Employee $empleado)
    {

        $empleado->load('user');

        return Inertia::render('Empleados/Show', ['empleado' => $empleado]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    #[Middleware('permission:editar empleado')]
    public function edit(Employee $empleado)
    {

        // traigo los datos del user asociado al usuario
        $empleado->load('user');

        return Inertia::render('Empleados/Edit', ['empleado' => $empleado]);
    }

    /**
     * Update the specified resource in storage.
     */

    #[Middleware('permission:editar empleado')]
    public function update(UpdateEmployeeRequest $request, Employee $empleado, UserService $userService, EmployeeService $employeeService)
    {

        DB::transaction(function () use ($request, $empleado, $userService, $employeeService) {

            $userService->updateUser($empleado->user, $request->validated());

            $employeeService->updateEmployee($empleado, $request->validated());
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */

    #[Middleware('permission:eliminar empleado')]
    public function destroy(Employee $empleado, UserService $userService, EmployeeService $employeeService)
    {

        DB::transaction(function () use ($empleado, $employeeService, $userService) {

            $user = $empleado->user;

            $employeeService->deleteEmployee($empleado);

            $userService->deleteUser($user);
        });

        return redirect()->route('empleados.index')->with('success', 'Empleado eliminado correctamente.');
    }
}
