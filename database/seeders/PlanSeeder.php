<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::firstOrCreate(['nombre' => 'Pase Basico'], [
            'precio' => 25000,
            'descripcion' => 'Acceso libre a sala de musculación y cardio.',
            'duracion' => 30,
            'incluye_entrenador' => false,
        ]);

        Plan::firstOrCreate(['nombre' => 'Plan Premium'], [
            'precio' => 50000,
            'descripcion' => 'Acceso total + seguimiento personalizado con entrenador asignado.',
            'duracion' => 30,
            'incluye_entrenador' => true,
        ]);

        Plan::firstOrCreate(['nombre' => 'Plan Basico Trimestral'], [
            'precio' => 60000,
            'descripcion' => 'Acceso libre por 90 días con tarifa promocional.',
            'duracion' => 90,
            'incluye_entrenador' => false,
        ]);
    }
}
