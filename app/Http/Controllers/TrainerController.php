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

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Trainer::class);

        $entrenadores = Trainer::with('employee.user')->latest()->get();

        return Inertia::render('Entrenadores/Index', ['entrenadores' => $entrenadores]);

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

        DB::transaction( function () use ($request, $userService, $employeeService){ 

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

        DB::transaction(function () use ($request, $entrenador, $userService, $employeeService){

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

        DB::transaction(function () use ($entrenador, $userService, $employeeService){

            $user = $entrenador->employee->user;
            $empleado = $entrenador->employee;

            $entrenador->delete();

            $employeeService->deleteEmployee($empleado);

            $userService->deleteUser($user);

        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador eliminado correctamente.');

    }




}
