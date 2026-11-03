<?php

namespace Database\Seeders;

use App\Models\Plan;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::firstOrCreate(['nombre' => 'Pase Basico'], [
            'precio' => 25000,
            'descripcion' => fake()->paragraph(),
            'duracion' => 30,
            'incluye_entrenador' => false,
        ]);

        Plan::firstOrCreate(['nombre' => 'Plan Premium'], [
            'precio' => 50000,
            'descripcion' => fake()->paragraph(),
            'duracion' => 30,
            'incluye_entrenador' => true,
        ]);
    }
}
