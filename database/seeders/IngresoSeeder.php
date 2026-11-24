<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Ingreso;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class IngresoSeeder extends Seeder
{
    public function run(): void
    {
        $suscripcionesVigentes = Subscription::where('estado', 'activa')
            ->whereDate('fecha_fin', '>=', now()->toDateString())
            ->get();

        $empleados = Employee::all();

        if ($suscripcionesVigentes->isEmpty() || $empleados->isEmpty()) {
            return;
        }

        foreach ($suscripcionesVigentes->take(15) as $sub) {
            $cantidadIngresos = fake()->numberBetween(1, 4);

            for ($i = 0; $i < $cantidadIngresos; $i++) {
                $diasAtras = fake()->numberBetween(0, min(5, Carbon::parse($sub->fecha_inicio)->diffInDays(now())));
                $fechaIngreso = now()
                    ->subDays($diasAtras)
                    ->setHour(fake()->numberBetween(8, 21))
                    ->setMinute(fake()->numberBetween(0, 59));

                Ingreso::create([
                    'client_id' => $sub->client_id,
                    'employee_id' => $empleados->random()->id,
                    'fecha_hora' => $fechaIngreso,
                ]);
            }
        }
    }
}
