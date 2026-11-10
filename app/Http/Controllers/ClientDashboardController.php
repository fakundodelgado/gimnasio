<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Ingreso;
use App\Models\Client;
//use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ClientDashboardController extends Controller
{
    public function index()
    {

        $fechaInicio = now()->subDays(30);
        $fechaFin = now();

        // Datos cliente
        $usuario = Auth::user();

        // Datos ingresos
        $ingresosMes = Ingreso::where('client_id', $usuario->client->id)->whereBetween('fecha_hora', [$fechaInicio, $fechaFin])->count();
        $ingresosTotales = Ingreso::where('client_id', $usuario->client->id)->count();

        // Dato entrenador
        $clienteConEntrenador = Client::with('trainer.employee.user')
            ->where('user_id', $usuario->id)
            ->first();

        // Puede no tener entrenador, depende del plan
        $entrenadorData = null;

        if ($clienteConEntrenador && $clienteConEntrenador->trainer) {
            $entrenadorData = [
                'nombre' => $clienteConEntrenador->trainer->employee->user->name,
                'especialidad' => $clienteConEntrenador->trainer->especialidad,
            ];
        }

        // Datos Plan
        $plan = Subscription::with(['plan', 'client'])->where('estado', 'activa')->where('client_id', $usuario->client->id)->first();

        // Datos suscripciones
        $suscripciones = Subscription::with('plan')
            ->where('client_id', $usuario->client->id)
            ->latest()
            ->get();

        // Datos pagos
        $pagosCliente = $usuario->client->payments()->latest()->get(); // Se realizo una modificación en el modelo para admitir esta consulta
        $totalGasto = $totalInvertido = $usuario->client->payments()->sum('monto');

        return Inertia::render('Clientes/Dashboard', [
            'usuario' => $usuario,
            'ingresosMes' => $ingresosMes,
            'ingresosTotales' => $ingresosTotales,
            'entrenador' => $entrenadorData,
            'plan' => $plan,
            'suscripciones' => $suscripciones,
            'pagosCliente' => $pagosCliente,
            'totalGasto' => $totalGasto,
        ]);
    }
}
