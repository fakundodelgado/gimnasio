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
        Plan::firstOrCreate(['nombre' => 'Pase Libre Mensual'], [
            'precio' => 25000,
            'descripcion' => fake()->paragraph(),
            'duracion' => 30,
        ]);

        Plan::firstOrCreate(['nombre' => 'Plan Trimestral'], [
            'precio' => 35000,
            'descripcion' => fake()->paragraph(),
            'duracion' => 90,
        ]);

        Plan::firstOrCreate(['nombre' => 'Plan Anual Premium'], [
            'precio' => 50000,
            'descripcion' => fake()->paragraph(),
            'duracion' => 360,
        ]);
    }
}
