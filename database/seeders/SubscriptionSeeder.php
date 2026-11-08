<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Client;
use App\Models\Trainer;
use App\Models\Subscription;
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

            // 1. HISTORIAL: Crear primero suscripciones pasadas (VENCIDAS)
            if ($index % 3 === 0) {
                Subscription::factory()->vencida()->create([
                    'client_id' => $client->id,
                    'plan_id'   => fake()->boolean() ? $planPremium->id : $planBasico->id,
                ]);
            }

            // 2. HISTORIAL: Crear suscripciones pasadas (CANCELADAS)
            if ($index % 4 === 0) {
                Subscription::factory()->cancelada()->create([
                    'client_id' => $client->id,
                    'plan_id'   => fake()->boolean() ? $planPremium->id : $planBasico->id,
                ]);
            }

            // 3. ACTUAL: Crear al final la suscripción ACTIVA (será la última en ID y fecha)
            $planActivo = ($index % 2 === 0) ? $planPremium : $planBasico;
            $hasTrainer = $planActivo->incluye_entrenador && $trainers->isNotEmpty();

            Subscription::factory()->activa()->create([
                'client_id' => $client->id,
                'plan_id'   => $planActivo->id,
                'precio'    => $planActivo->precio,
            ]);

            // Sincronizamos el trainer_id en la tabla clients
            $client->update([
                'trainer_id' => $hasTrainer ? $trainers->random()->id : null,
            ]);
        }
    }
}
