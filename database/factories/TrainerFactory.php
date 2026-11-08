<?php

namespace Database\Factories;

use App\Models\Trainer;
use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Trainer>
 */
class TrainerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'especialidad' => fake()->randomElement([
                'Musculación y Hipertrofia',
                'Entrenamiento Funcional',
                'CrossFit',
                'Ciclismo Indoor',
                'Rehabilitación y Postural',
                'Calistenia',
            ]),
            'limite_alumnos' => fake()->numberBetween(10, 30),
        ];
    }
}
