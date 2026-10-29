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

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Employee::class);

        $empleados = Employee::with('user')->latest()->get();

        return Inertia::render('Empleados/Index', ['empleados' => $empleados]);

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

        DB::transaction(function () use ($request, $employeeService, $userService){

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

        DB::transaction(function () use($request, $empleado, $userService, $employeeService){

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

        DB::transaction(function () use ($empleado, $employeeService, $userService){

            $user = $empleado->user;

            $employeeService->deleteEmployee($empleado);
            
            $userService->deleteUser($user);

        });

        return redirect()->route('empleados.index')->with('success', 'Empleado eliminado correctamente.');
    }
}
