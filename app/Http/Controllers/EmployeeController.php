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

        $esAdmin = $request->user()->hasAnyRole(['admin', 'super']);

        $buscarTexto = trim($request->input('buscar_texto', ''));
        $buscarNumero = trim($request->input('buscar_numero', ''));
        $orden = $request->input('orden', 'id');
        $papelera = $request->input('papelera', 'sin_eliminados');
        $direccion = $request->input('direccion', 'asc');
        $tipo = $request->input('tipo', '');
        $paginas = (int) $request->input('paginas', 5);

        $camposPermitidos = ['nombre', 'id', 'cuil', 'created_at'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($paginas, [5, 10, 20], true)) {
            $paginas = 5;
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        // Ahora que lo piendo es al pedo esta comprobación, digo, solo los admin tiene acceso a esta pestaña... luego habra que sacarlo
        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        if (!in_array($papelera, ['sin_eliminados', 'solo_eliminados', 'con_eliminados'], true)) {
            $papelera = 'sin_eliminados';
        }

        if (!in_array($tipo, ['', 'entrenador', 'administrativo'], true)) {
            $tipo = '';
        }

        $query = Employee::with(['user' => fn($q) => $q->withTrashed(), 'trainer']);

        // Podrian ir en un solo when, aunque mepa que ni hacen falta...
        $query->when($papelera === 'solo_eliminados', function ($q) use ($papelera) {
            $q->onlyTrashed();
        });

        $query->when($papelera === 'con_eliminados', function ($q) use ($papelera) {
            $q->withTrashed();
        });

        $query->when($buscarTexto !== '', function ($q) use ($buscarTexto) {
            // Es como una especie de subconsulta donde veo si tengo user
            $q->whereHas('user', function ($userQ) use ($buscarTexto) {
                // Esto con lo de arriba forman un and (además no me debo olvidar de los posibles users con softdelete)
                $userQ->withTrashed()->where(function ($subQ) use ($buscarTexto) {
                    // Estos dos son un OR
                    $subQ->where('name', 'like', "%{$buscarTexto}%")
                        ->orWhere('email', 'like', "%{$buscarTexto}%");
                });
            });
        });

        $query->when($buscarNumero !== '', function ($q) use ($buscarNumero) {
            // AND
            $q->where(function ($subQ) use ($buscarNumero) {
                // OR (en realidad primero tengo un and pero es como si fuera algo como ($buscarNumero !== and (condicion o condicion o condicion)))
                $subQ->where('employees.cuil', 'like', "%{$buscarNumero}%")
                    ->orWhere('employees.telefono', 'like', "%{$buscarNumero}%");
            });
        });

        $query->when($tipo !== '', function ($q) use ($tipo) {
            if ($tipo === 'entrenador') {
                $q->whereHas('trainer');
            } elseif ($tipo === 'administrativo') {
                $q->whereDoesntHave('trainer');
            }
        });

        if ($orden === 'nombre') {
            $query->join('users', 'employees.user_id', '=', 'users.id')
                ->select('employees.*')
                ->orderBy('users.name', $direccion);
        } else {
            $query->orderBy("employees.{$orden}", $direccion);
        }

        $query->orderBy('employees.id', 'asc');

        $empleados = $query->paginate($paginas)->withQueryString();

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
            'filtros' => [
                'buscar_texto' => $buscarTexto,
                'buscar_numero' => $buscarNumero,
                'orden' => $orden,
                'papelera' => $papelera,
                'direccion' => $direccion,
                'tipo' => $tipo,
                'paginas' => $paginas
            ],
            'esAdmin' => $esAdmin
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
