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
        $ingresos = Ingreso::with(['employee.user', 'client.user'])
            ->latest('fecha_hora')
            ->get();

        return Inertia::render('Ingresos/Index', [
            'ingresos' => $ingresos,
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
