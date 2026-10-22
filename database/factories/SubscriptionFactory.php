<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Subscription;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fecha_inicio = fake()->dateTimeBetween('-2 month', 'now'); // Fecha entre dos meses anteriores y el dia de hoy, a now tambien pongo como cadena
        $plan = Plan::factory();

        return [
            'client_id' => Client::factory(),
            'plan_id' => $plan,
            'precio' => fake()->randomFloat(2,5000,50000),
            'fecha_inicio' => $fecha_inicio->format('Y-m-d'), //Year-month-day
            'fecha_fin' => (clone $fecha_inicio)->modify('+30 days')->format('Y-m-d'),
            'estado' => fake()->randomElement(['activa', 'vencida', 'cancelada']),

        ];
    }

    // Las funciones de abajo son conocidas como states, me permiten controlar hasta cierto punto los datos que se genera, además me ayudan a evitar
    // inconsistencias, por ejemplo, un estado vencido pero con fecha de inicio el dia de ayer.

    public function activa(): static
    {
        return $this->state(function (array $attributes) {
            $inicio = now()->subDays(fake()->numberBetween(1, 15));
            return [
                'estado' => 'activa',
                'fecha_inicio' => $inicio->format('Y-m-d'),
                'fecha_fin' => (clone $inicio)->modify('+30 days')->format('Y-m-d'),
            ];
        });
    }

    public function vencida(): static
    {
        return $this->state(function (array $attributes) {
            $inicio = now()->subDays(fake()->numberBetween(40, 90));
            return [
                'estado' => 'vencida',
                'fecha_inicio' => $inicio->format('Y-m-d'),
                'fecha_fin' => (clone $inicio)->modify('+30 days')->format('Y-m-d'),
            ];
        });
    }

    public function cancelada(): static
    {
        return $this->state(fn (array $attributes) => [
            'estado' => 'cancelada',
        ]);
    }
}
