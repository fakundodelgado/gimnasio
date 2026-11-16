<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIngresoRequest;
use App\Models\Client;
use App\Models\Ingreso;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class IngresoController extends Controller
{

    #[Middleware('permission:listar ingresos')]
    public function index(Request $request)
    {

        // Buscan por ID o Nombre
        $cliente = trim($request->input('cliente', ''));
        $empleado = trim($request->input('empleado', ''));

        $direccion = $request->input('direccion', 'desc');
        $paginas = (int) $request->input('paginas', 5);

        // Para filtrar entre dos fechas
        $desde = trim($request->input('desde', ''));
        $hasta = trim($request->input('hasta', ''));

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'desc';
        }

        if (!in_array($paginas, [5, 10, 25], true)) {
            $paginas = 5;
        }

        // Esta es la forma de validar las fechas 
        if ($desde !== '' && !\DateTime::createFromFormat('Y-m-d', $desde)) {
            $desde = '';
        }

        if ($hasta !== '' && !\DateTime::createFromFormat('Y-m-d', $hasta)) {
            $hasta = '';
        }

        $query = Ingreso::with([
            'employee' => fn($q) => $q->withTrashed()->with(['user' => fn($uq) => $uq->withTrashed()]),
            'client'   => fn($q) => $q->withTrashed()->with(['user' => fn($uq) => $uq->withTrashed()]),
        ]);

        $query->when($desde !== '', function ($q) use ($desde) {
            $q->whereDate('created_at', '>=', $desde);
        });

        $query->when($hasta !== '', function ($q) use ($hasta) {
            $q->whereDate('created_at', '<=', $hasta);
        });

        $query->when($cliente !== '', function ($q) use ($cliente) {
            $q->whereHas('client', function ($clientQ) use ($cliente) {
                $clientQ->withTrashed()->whereHas('user', function ($userQ) use ($cliente) {
                    $userQ->withTrashed()->where(function ($subQ) use ($cliente) {
                        $subQ->where('users.name', 'like', "%{$cliente}%")
                            ->orWhere('clients.id', 'like', "%{$cliente}%");
                    });
                });
            });
        });

        $query->when($empleado !== '', function ($q) use ($empleado) {
            $q->whereHas('employee', function ($employeeQ) use ($empleado) {
                $employeeQ->withTrashed()->whereHas('user', function ($userQ) use ($empleado) {
                    $userQ->withTrashed()->where(function ($subQ) use ($empleado) {
                        $subQ->where('users.name', 'like', "%{$empleado}%")
                            ->orWhere('employees.id', 'like', "%{$empleado}%");
                    });
                });
            });
        });

        $query->orderBy('created_at', $direccion)->orderBy('id', 'desc');

        $ingresos = $query->paginate($paginas)->withQueryString();

        return Inertia::render('Ingresos/Index', [
            'ingresos' => $ingresos,
            'filtros' => [
                'cliente' => $cliente,
                'empleado' => $empleado,
                'desde' => $desde,
                'hasta' => $hasta,
                'direccion' => $direccion,
                'paginas' => $paginas,
            ],
        ]);
    }

    #[Middleware('permission:crear ingreso')]
    public function create()
    {
        return Inertia::render('Ingresos/Create');
    }

    #[Middleware('permission:crear ingreso')]
    public function store(StoreIngresoRequest $request)
    {
        $datos = $request->validated();

        $client = Client::with(['user', 'activeSubscription.plan'])->find($datos['client_id']);

        if (!$client) {
            return back()->with('error_acceso', 'Cliente no encontrado. Verifique el ID ingresado.');
        }

        if (!$client->activeSubscription) {
            return back()->with('error_acceso', "ACCESO DENEGADO: El socio {$client->user->name} no posee suscripción activa.");
        }

        $user = $request->user();
        $employeeId = null;

        if ($user && $user->employee) {
            $employeeId = $user->employee->id;
        } else {
            $adminEmployeeUser = User::where('email', 'empleadofalso@gimnasio.com')->first();
            if ($adminEmployeeUser && $adminEmployeeUser->employee) {
                $employeeId = $adminEmployeeUser->employee->id;
            }
        }

        Ingreso::create([
            'client_id'   => $client->id,
            'employee_id' => $employeeId,
            'fecha_hora'  => now(),
        ]);

        $planNombre = $client->activeSubscription->plan->nombre ?? 'Activo';

        return back()->with('exito_acceso', "ACCESO PERMITIDO: ¡Bienvenido/a {$client->user->name}! ({$planNombre})");
    }
}
