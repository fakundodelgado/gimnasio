<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plan>
 */
class PlanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'precio' => fake()->randomFloat(2, 10000, 50000),
            'nombre' => fake()->unique()->randomElement([
                'Pase Libre Mensual',
                'Musculación Estándar',
                'Plan Trimestral',
                'Plan Anual Premium',
                'Pase Estudiantil'
            ]),
            'descripcion' => fake()->paragraph(),
            'duracion' => fake()->randomElement([30, 90, 180]),
            'incluye_entrenador' => fake()->boolean(),
        ];
    }

    // Este state me ayuda a forzar planes mensuales.

    public function mensual(): static
    {
        return $this->state(fn(array $attributes) => [
            'duracion' => 30,
        ]);
    }
}
