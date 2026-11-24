<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'employee_id' => fn() => Employee::whereHas('user', fn($q) => $q->role('employee'))
                ->inRandomOrder()
                ->first()?->id ?? Employee::factory(),
            'subscription_id' => Subscription::factory(),
            'fecha_pago' => function (array $attr) {
                $sub = is_numeric($attr['subscription_id'])
                    ? Subscription::withTrashed()->find($attr['subscription_id'])
                    : null;

                return $sub?->fecha_inicio ?? now()->format('Y-m-d');
            },
            'metodo_pago' => fake()->randomElement(['efectivo', 'transferencia', 'tarjeta']),
            'monto' => function (array $attr) {
                $sub = is_numeric($attr['subscription_id'])
                    ? Subscription::withTrashed()->find($attr['subscription_id'])
                    : null;

                return $sub?->precio ?? 25000;
            },
        ];
    }

    public function parcial(): static
    {
        return $this->state(fn(array $attr) => [
            'monto' => function (array $finalAttr) {
                $sub = Subscription::withTrashed()->find($finalAttr['subscription_id']);
                return round(($sub?->precio ?? 25000) / 2, 2);
            },
        ]);
    }

    public function anulado(): static
    {
        return $this->state(fn(array $attr) => [
            'deleted_at' => now(),
        ]);
    }
}
