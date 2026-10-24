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
        $suscripciones = Subscription::all();
        $empleados = Employee::all();

        if ($empleados->isNotEmpty() && $suscripciones->isNotEmpty()) {
            Payment::factory(20)->create([
                'subscription_id' => fn() => $suscripciones->random()->id,
                'employee_id'     => fn() => $empleados->random()->id,
            ]);
        }
    }
}
