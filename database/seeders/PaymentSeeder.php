<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Subscription;
use App\Models\Payment;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suscripcionesPagas = Subscription::whereIn('estado', ['activa', 'vencida'])->get();

        $empleados = Employee::whereHas('user', function ($query) {
            $query->role('employee');
        })->get();

        if ($empleados->isNotEmpty() && $suscripcionesPagas->isNotEmpty()) {
            $suscripcionesPagas->each(function ($suscripcion) use ($empleados) {
                Payment::factory()->create([
                    'subscription_id' => $suscripcion->id,
                    'employee_id' => $empleados->random()->id,
                    // Esto me ayuda a generar fechas de pagos adecuadas, sino me tiraba cualquier cosa sin sentido.
                    // Por ejemplo un pago con fecha actual y una suscripcion de hace meses por ejemplo.
                    'created_at' => $suscripcion->fecha_inicio,
                ]);
            });
        }
    }
}
