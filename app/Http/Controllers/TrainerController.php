<?php

namespace App\Http\Controllers;

use App\Models\Trainer;
use App\Models\Client;
use App\Http\Requests\StoreTrainerRequest;
use App\Http\Requests\UpdateTrainerRequest;
use App\Services\EmployeeService;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class TrainerController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    #[Middleware('permission:listar entrenadores')]
    public function index(Request $request)
    {
        $buscarTexto = trim((string) $request->input('buscar_texto', ''));
        $buscarNumero = trim((string) $request->input('buscar_numero', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $papelera = $request->input('papelera', 'sin_eliminados');
        $paginas = (int) $request->input('paginas', 5);

        $esAdmin = $request->user()->hasAnyRole(['admin', 'super']);

        $camposPermitidos = ['id', 'nombre', 'limite_alumnos', 'clients_count'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($paginas, [5, 10, 20], true)) {
            $paginas = 5;
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        if (!in_array($papelera, ['sin_eliminados', 'solo_eliminados', 'con_eliminados'], true)) {
            $papelera = 'sin_eliminados';
        }

        $query = Trainer::query()->select('trainers.*');

        $query->with([
            'employee' => fn($empQ) => $empQ->withTrashed()->with([
                'user' => fn($userQ) => $userQ->withTrashed(),
            ]),
        ]);

        $query->withCount(['clients' => function ($q) {
            $q->whereHas('subscriptions', function ($subQ) {
                $subQ->where('estado', 'activa');
            });
        }]);

        $query->when($papelera === 'con_eliminados', function ($q) {
            $q->withTrashed();
        });

        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        });

        $query->when($buscarTexto !== '', function ($q) use ($buscarTexto) {
            $q->where(function ($subQ) use ($buscarTexto) {
                $subQ->where('trainers.especialidad', 'like', "%{$buscarTexto}%")
                    ->orWhereHas('employee', function ($empQ) use ($buscarTexto) {
                        $empQ->withTrashed()->whereHas('user', function ($userQ) use ($buscarTexto) {
                            $userQ->withTrashed()->where(function ($uSubQ) use ($buscarTexto) {
                                $uSubQ->where('name', 'like', "%{$buscarTexto}%")
                                    ->orWhere('email', 'like', "%{$buscarTexto}%");
                            });
                        });
                    });
            });
        });

        $query->when($buscarNumero !== '', function ($q) use ($buscarNumero) {
            $q->whereHas('employee', function ($empQ) use ($buscarNumero) {
                $empQ->withTrashed()->where(function ($eSubQ) use ($buscarNumero) {
                    $eSubQ->where('cuil', 'like', "%{$buscarNumero}%")
                        ->orWhere('telefono', 'like', "%{$buscarNumero}%");
                });
            });
        });

        if ($orden === 'nombre') {
            $query->leftJoin('employees', 'trainers.employee_id', '=', 'employees.id')
                ->leftJoin('users', 'employees.user_id', '=', 'users.id')
                ->orderBy('users.name', $direccion);
        } elseif ($orden === 'clients_count') {
            $query->orderBy('clients_count', $direccion);
        } else {
            $query->orderBy("trainers.{$orden}", $direccion);
        }

        $query->orderBy('trainers.id', 'asc');

        $entrenadores = $query->paginate($paginas)->withQueryString();

        return Inertia::render('Entrenadores/Index', [
            'entrenadores' => $entrenadores,
            'filtros' => [
                'buscar_texto'  => $buscarTexto,
                'buscar_numero' => $buscarNumero,
                'orden'         => $orden,
                'direccion'     => $direccion,
                'papelera'      => $papelera,
                'paginas'       => $paginas,
            ],
            'esAdmin' => $esAdmin,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    #[Middleware('permission:crear entrenador')]
    public function create()
    {
        return Inertia::render('Entrenadores/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    #[Middleware('permission:crear entrenador')]
    public function store(StoreTrainerRequest $request, UserService $userService, EmployeeService $employeeService)
    {
        DB::transaction(function () use ($request, $userService, $employeeService) {

            $user = $userService->createUser($request->validated(), 'trainer');

            $employee = $employeeService->createEmployee($user->id, $request->validated());

            $employee->trainer()->create([
                'especialidad' => $request->especialidad,
                'limite_alumnos' => $request->limite_alumnos,
            ]);
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    #[Middleware('permission:mostrar entrenador')]
    public function show(Trainer $entrenador)
    {
        $entrenador->load('employee.user');
        $alumnos = Client::where('trainer_id', $entrenador->id)->count();

        return Inertia::render('Entrenadores/Show', ['entrenador' => $entrenador, 'alumnos' => $alumnos]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    #[Middleware('permission:editar entrenador')]
    public function edit(Trainer $entrenador)
    {
        $entrenador->load('employee.user');

        return Inertia::render('Entrenadores/Edit', ['entrenador' => $entrenador]);
    }

    /**
     * Update the specified resource in storage.
     */

    #[Middleware('permission:editar entrenador')]
    public function update(UpdateTrainerRequest $request, Trainer $entrenador, UserService $userService, EmployeeService $employeeService)
    {
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

    #[Middleware('permission:eliminar entrenador')]
    public function destroy(Trainer $entrenador, UserService $userService, EmployeeService $employeeService)
    {
        DB::transaction(function () use ($entrenador, $userService, $employeeService) {

            $user = $entrenador->employee->user;
            $empleado = $entrenador->employee;

            $entrenador->delete();

            $employeeService->deleteEmployee($empleado);

            $userService->deleteUser($user);
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador eliminado correctamente.');
    }

    #[Middleware('permission:restaurar entrenador')]
    public function restore(Trainer $entrenador, UserService $userService, EmployeeService $employeeService)
    {
        DB::transaction(function () use ($entrenador, $userService, $employeeService) {
            $entrenador->restore();

            $empleado = $entrenador->employee()->withTrashed()->first();
            if ($empleado) {
                $employeeService->restoreEmployee($empleado);

                $user = $empleado->user()->withTrashed()->first();
                if ($user) {
                    $userService->restoreUser($user);
                }
            }
        });

        return redirect()->route('entrenadores.index')->with('success', 'Entrenador restaurado correctamente.');
    }
}
