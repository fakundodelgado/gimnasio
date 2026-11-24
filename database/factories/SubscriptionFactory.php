<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Subscription>
 */
class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'plan_id' => Plan::inRandomOrder()->first()?->id ?? Plan::factory(),
            'precio' => fn(array $attr) => Plan::find(value($attr['plan_id']))?->precio ?? 25000,
            'fecha_inicio' => now()->format('Y-m-d'),
            'fecha_fin' => function (array $attr) {
                $duracion = Plan::find(value($attr['plan_id']))?->duracion ?? 30;
                return Carbon::parse($attr['fecha_inicio'])->addDays($duracion)->format('Y-m-d');
            },
            'estado' => 'activa',
        ];
    }

    public function activa(?int $diasTranscurridos = null): static
    {
        return $this->state(function (array $attr) use ($diasTranscurridos) {
            $duracion = Plan::find(value($attr['plan_id']))?->duracion ?? 30;
            $dias = $diasTranscurridos ?? fake()->numberBetween(1, max(1, $duracion - 5));

            return [
                'estado' => 'activa',
                'fecha_inicio' => now()->subDays($dias)->format('Y-m-d'),
            ];
        });
    }

    public function pendiente(?int $diasTranscurridos = null): static
    {
        return $this->state(function (array $attr) use ($diasTranscurridos) {
            $duracion = Plan::find(value($attr['plan_id']))?->duracion ?? 30;
            $dias = $diasTranscurridos ?? fake()->numberBetween(1, (int) floor($duracion / 2));

            return [
                'estado' => 'pendiente',
                'fecha_inicio' => now()->subDays($dias)->format('Y-m-d'),
            ];
        });
    }

    public function vencida(): static
    {
        return $this->state(function (array $attr) {
            $duracion = Plan::find(value($attr['plan_id']))?->duracion ?? 30;
            $dias = $duracion + fake()->numberBetween(5, 45);

            return [
                'estado' => 'vencida',
                'fecha_inicio' => now()->subDays($dias)->format('Y-m-d'),
            ];
        });
    }

    public function cancelada(): static
    {
        return $this->state(fn(array $attr) => [
            'estado' => 'cancelada',
        ]);
    }
}
