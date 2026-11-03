<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Client;
use App\Models\Trainer;
use App\Models\Subscription;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Client::all();
        $planBasico = Plan::where('incluye_entrenador', false)->first();
        $planPremium = Plan::where('incluye_entrenador', true)->first();
        $trainers = Trainer::all();

        if ($clientes->isEmpty() || !$planBasico || !$planPremium) {
            return;
        }

        foreach ($clientes as $index => $client) {
            // 1. Alternamos la suscripción ACTIVA actual: par -> Premium, impar -> Básico
            $planActivo = ($index % 2 === 0) ? $planPremium : $planBasico;

            $hasTrainer = $planActivo->incluye_entrenador && $trainers->isNotEmpty();

            // Sincronizamos el trainer_id en el cliente según su suscripción activa actual
            $client->update([
                'trainer_id' => $hasTrainer ? $trainers->random()->id : null,
            ]);

            // Crear la suscripción ACTIVA
            Subscription::factory()->activa()->create([
                'client_id' => $client->id,
                'plan_id'   => $planActivo->id,
                'precio'    => $planActivo->precio,
            ]);

            // 2. Historial: generar a algunos clientes una suscripción VENCIDA anterior
            if ($index % 3 === 0) {
                Subscription::factory()->vencida()->create([
                    'client_id' => $client->id,
                    'plan_id'   => fake()->boolean() ? $planPremium : $planBasico,
                ]);
            }

            // 3. Historial: generar a algunos clientes una suscripción CANCELADA anterior
            if ($index % 4 === 0) {
                Subscription::factory()->cancelada()->create([
                    'client_id' => $client->id,
                    'plan_id'   => fake()->boolean() ? $planPremium : $planBasico,
                ]);
            }
        }

        Client::all()->each(function ($client) {
            $planActivo = $client->activeSubscription?->plan;

            // Si no tiene suscripción activa o su plan activo NO incluye entrenador, se remueve el trainer_id
            if (!$planActivo || !$planActivo->incluye_entrenador) {
                $client->update(['trainer_id' => null]);
            }
        });
    }
}
