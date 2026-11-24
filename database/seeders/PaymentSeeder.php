<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $suscripciones = Subscription::withTrashed()->get();
        $empleados = Employee::whereHas('user', fn($q) => $q->role('employee'))->get();

        if ($empleados->isEmpty() || $suscripciones->isEmpty()) {
            return;
        }

        // Identificamos las pendientes para dejar una de ellas con un 2° pago anulado de ejemplo
        $pendientesVistas = 0;

        foreach ($suscripciones as $index => $sub) {
            $empleadoId = $empleados->random()->id;

            // 1. Suscripción eliminada -> pago también eliminado
            if ($sub->trashed()) {
                Payment::factory()->anulado()->create([
                    'subscription_id' => $sub->id,
                    'employee_id' => $empleadoId,
                ]);
                continue;
            }

            // 2. Suscripción pendiente -> 1 pago parcial (50%)
            if ($sub->estado === 'pendiente') {
                $pendientesVistas++;

                Payment::factory()->parcial()->create([
                    'subscription_id' => $sub->id,
                    'employee_id' => $empleadoId,
                ]);

                // En la última pendiente (Caso 4) agregamos además un pago anulado
                if ($pendientesVistas === 3) {
                    Payment::factory()->parcial()->anulado()->create([
                        'subscription_id' => $sub->id,
                        'employee_id' => $empleadoId,
                        'fecha_pago' => now()->subDay()->format('Y-m-d'),
                    ]);
                }
                continue;
            }

            // 3. Suscripción activa o vencida:
            // La primera activa (Juan Pérez) y algunas más van en 2 cuotas (50% + 50%); el resto en 1 pago total
            if ($sub->estado === 'activa' && ($index === 1 || $index % 6 === 0)) {
                Payment::factory()->parcial()->create([
                    'subscription_id' => $sub->id,
                    'employee_id' => $empleadoId,
                ]);
                Payment::factory()->parcial()->create([
                    'subscription_id' => $sub->id,
                    'employee_id' => $empleadoId,
                    'fecha_pago' => now()->subDays(2)->format('Y-m-d'),
                ]);
            } else {
                Payment::factory()->create([
                    'subscription_id' => $sub->id,
                    'employee_id' => $empleadoId,
                ]);
            }
        }
    }
}
