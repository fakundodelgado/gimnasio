<?php

namespace Database\Factories;

use App\Models\Turn;
use App\Models\Client;
use App\Models\Trainer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Turn>
 */
class TurnFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'trainer_id' => Trainer::factory(),
            'dia' => fake()->randomElement(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']),
            'hora' => fake()->randomElement(['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']),
        ];
    }
}
