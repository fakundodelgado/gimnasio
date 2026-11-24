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
            'precio' => fake()->randomElement([20000, 25000, 35000, 50000, 60000]),
            'nombre' => 'Plan ' . ucfirst(fake()->words(2, true)),
            'descripcion' => fake()->sentence(10),
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
