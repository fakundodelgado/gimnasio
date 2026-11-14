<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Models\Ingreso;
use App\Models\Payment;
use Inertia\Inertia;

class EmployeeDashboardController extends Controller
{
    public function index()
    {

        $usuario = auth()->user();

        // Obtengo el empleado 
        $empleadoId = $usuario->employee->id;

        // Dia actual y ultimo mes
        $fechaActual = now();
        $ultimoMes = now()->subDays(30);
        $semana = now()->addDays(7);

        // Ingresos asociados al empleado logueado en total y en el ultimo mes
        $ingresosPermitidos = Ingreso::where('employee_id', $empleadoId)->count();
        $ingresosMes = Ingreso::where('employee_id', $empleadoId)->whereBetween('fecha_hora', [$ultimoMes, $fechaActual])->count();

        // Pagos
        $pagosRegistrados = Payment::where('employee_id', $empleadoId)->count();
        $pagosMes = Payment::where('employee_id', $empleadoId)->whereBetween('fecha_pago', [$ultimoMes, $fechaActual])->count();

        // Suscripciones asociadas al empleado logueado en total y en el ultimo mes 
        $suscripcionesTotales = Subscription::whereHas('payments', function ($query) use ($empleadoId) {
            $query->where('employee_id', $empleadoId)->where('id', function ($subQuery) {
                $subQuery->selectRaw('MIN(id)')->from('payments')->whereColumn('subscription_id', 'subscriptions.id')->whereNull('deleted_at');
            });
        })->count();
        // No me termino de acostumbrar a eloquent, es un dolor de cabeza...
        $suscripcionesMes = Subscription::whereHas('payments', function ($query) use ($empleadoId, $ultimoMes, $fechaActual) {
            $query->where('employee_id', $empleadoId)
                ->whereBetween('fecha_pago', [$ultimoMes, $fechaActual])
                ->where('id', function ($subQuery) {
                    $subQuery->selectRaw('MIN(id)')->from('payments')->whereColumn('subscription_id', 'subscriptions.id')->whereNull('deleted_at');
                });
        })->count();

        $suscripcionesVencer = Subscription::with(['client.user', 'plan'])->where('estado', 'activa')->whereBetween('fecha_fin', [now(), $semana])->get();
        $ultimosPagos = Payment::with('subscription.client.user')->where('employee_id', $empleadoId)->latest()->take(5)->get();

        return Inertia::render('Empleados/Dashboard', [
            'usuario' => $usuario,
            'ingresosPermitidos' => $ingresosPermitidos,
            'ingresosMes' => $ingresosMes,
            'pagosRegistrados' => $pagosRegistrados,
            'pagosMes' => $pagosMes,
            'suscripcionesTotales' => $suscripcionesTotales,
            'suscripcionesMes' => $suscripcionesMes,
            'ultimosPagos' => $ultimosPagos,
            'suscripcionesVencer' => $suscripcionesVencer
        ]);
    }
}
