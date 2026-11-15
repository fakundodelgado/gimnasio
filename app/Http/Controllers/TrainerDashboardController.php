<?php

namespace App\Http\Controllers;

//use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Client;
use App\Models\Ingreso;

class TrainerDashboardController extends Controller
{
    public function index()
    {

        // Datos del entrenador
        $usuario = auth()->user();
        $entrenador = $usuario->employee->trainer;

        // Traer todos los alumnos para poder mostrarlos
        $alumnos = Client::with(['user', 'subscriptions' => fn($query) => $query->where('estado', 'activa')->with('plan')])->where('trainer_id', $entrenador->id)->get();

        // Alumnos actuales y cupos disponibles
        $totalAlumnos = $alumnos->count();
        $cuposDisponibles = max(0, $entrenador->limite_alumnos - $totalAlumnos);

        // Alumnos que vinieron hoy al gimnasio
        $alumnosId = $alumnos->pluck('id');
        $asistencias = Ingreso::whereIn('client_id', $alumnosId)->whereDate('fecha_hora', today())->distinct()->count('client_id');


        return Inertia::render('Entrenadores/Dashboard', [
            'usuario' => $usuario,
            'entrenador' => $entrenador,
            'alumnos' => $alumnos,
            'totalAlumnos' => $totalAlumnos,
            'cuposDisponibles' => $cuposDisponibles,
            'asistencias' => $asistencias
        ]);
    }
}
