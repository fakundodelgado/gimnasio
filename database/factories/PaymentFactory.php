<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Employee;
use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $empleado = Employee::factory();
        $subscripcion = Subscription::factory();

        return [

            'employee_id' => $empleado,
            'subscription_id' => $subscripcion,
            'fecha_pago' => fake()->dateTimeBetween('-1 month', 'now'),
            'metodo_pago' => fake()->randomElement(['efectivo', 'transferencia', 'terjeta']),
            // Aqui se complica un poco, lo que quiero es obtener el valor de la subscription (total a pagar)
            'monto' => function (array $atributos) {
                return Subscription::find($atributos['subscription_id'])?->precio ?? fake()->randomFloat(2,10000,50000);
            }
            
        ];
    }

    public function parcial(float $porcentaje = 0.5): static
    {
        return $this->state(function (array $attributes) use ($porcentaje) {
            $precioBase = Subscription::find($attributes['subscription_id'])?->precio ?? 10000; 
            // el ? es como el coalesce que vemos en base de datos, si el valor llega a ser nulo manda un 10000.
            // Esto se debe mas a un tecnicismo de las factories mas que de un caso que pueda llegar a pasar en la vida real por como defini la BD.
            return [
                'monto' => $precioBase * $porcentaje,
            ];
        });
    }

}
