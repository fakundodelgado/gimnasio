<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Employee;
use App\Models\Payment;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Plan;
use App\Models\Trainer;
//use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {

        $fechaInicio = now()->subDays(30);
        $fechaFin = now();

        // Datos clientes
        $clientes = Client::count();
        $clientesActivos = Client::whereHas('subscriptions', function ($query) {
            $query->where('estado', 'activa');
        })->count();
        $clientesInactivos = $clientes - $clientesActivos;

        // Datos usuarios/roles
        $usuarios = User::count();
        $empleados = Employee::count();
        $entrenadores = Trainer::count();

        // Planes (Array)
        $planes = Plan::withCount('subscriptions')->get();

        // Suscripciones
        $suscripciones = Subscription::count();
        $suscripcionesActivas = Subscription::where('estado', 'activa')->count();
        $suscripcionesInactivas = $suscripciones - $suscripcionesActivas;

        // Pagos
        $pagos = Payment::count();
        $pagosMes = Payment::whereBetween('fecha_pago', [$fechaInicio, $fechaFin])->count();

        return Inertia::render('Administradores/Dashboard', [
            'clientes' => $clientes,
            'clientesActivos' => $clientesActivos,
            'clientesInactivos' => $clientesInactivos,
            'usuarios' => $usuarios,
            'empleados' => $empleados,
            'entrenadores' => $entrenadores,
            'planes' => $planes,
            'suscripciones' => $suscripciones,
            'suscripcionesActivas' => $suscripcionesActivas,
            'suscripcionesInactivas' => $suscripcionesInactivas,
            'pagos' => $pagos,
            'pagosMes' => $pagosMes,
        ]);
    }
}
