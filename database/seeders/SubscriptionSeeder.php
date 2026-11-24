<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Trainer;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = Client::all();
        $planBasico = Plan::where('nombre', 'Pase Basico')->first();
        $planPremium = Plan::where('nombre', 'Plan Premium')->first();
        $trainers = Trainer::all();

        if ($clientes->isEmpty() || !$planBasico || !$planPremium) {
            return;
        }

        // Control de cupo por entrenador (limite_alumnos)
        $cuposUsados = $trainers->mapWithKeys(
            fn($t) => [$t->id => Client::where('trainer_id', $t->id)->count()]
        )->toArray();

        $asignarTrainer = function () use ($trainers, &$cuposUsados): ?int {
            foreach ($trainers->shuffle() as $trainer) {
                if (($cuposUsados[$trainer->id] ?? 0) < $trainer->limite_alumnos) {
                    $cuposUsados[$trainer->id]++;
                    return $trainer->id;
                }
            }
            return null;
        };

        foreach ($clientes as $index => $client) {

            // 1. Historial vencido previo para algunos clientes
            if ($index % 4 === 0) {
                Subscription::factory()->vencida()->create([
                    'client_id' => $client->id,
                ]);
            }

            // 2. Casos específicos para probar todas las reglas en clase
            switch ($index) {
                // Caso 0: Juan Pérez (cliente@gimnasio.com) -> Activa Premium al día con entrenador
                case 0:
                    $sub = Subscription::factory()->activa(5)->create([
                        'client_id' => $client->id,
                        'plan_id' => $planPremium->id,
                    ]);
                    break;

                // Caso 1: Pendiente reciente (3 días) -> Lista para cobrar la 2da cuota
                case 1:
                    $sub = Subscription::factory()->pendiente(3)->create([
                        'client_id' => $client->id,
                        'plan_id' => $planPremium->id,
                    ]);
                    break;

                // Caso 2: Pendiente con > mitad de duración (18 días) -> Pasa a "cancelada" con "Actualizar estados"
                case 2:
                    $sub = Subscription::factory()->pendiente(18)->create([
                        'client_id' => $client->id,
                        'plan_id' => $planBasico->id,
                    ]);
                    break;

                // Caso 3: Activa con fecha_fin vencida (33 días) -> Pasa a "vencida" al registrar ingreso o actualizar estados
                case 3:
                    $sub = Subscription::factory()->activa(33)->create([
                        'client_id' => $client->id,
                        'plan_id' => $planBasico->id,
                    ]);
                    break;

                // Caso 4: Pendiente con 1 pago activo + 1 pago anulado (para probar filas rojas en reportes y restaurar pago)
                case 4:
                    $sub = Subscription::factory()->pendiente(4)->create([
                        'client_id' => $client->id,
                        'plan_id' => $planPremium->id,
                    ]);
                    break;

                // Caso 5: Suscripción eliminada (SoftDeleted) -> Para probar restauración en cascada con su pago
                case 5:
                    $sub = Subscription::factory()->cancelada()->create([
                        'client_id' => $client->id,
                        'plan_id' => $planBasico->id,
                        'deleted_at' => now(),
                    ]);
                    break;

                // Resto de clientes: suscripción activa aleatoria entre los 3 planes reales
                default:
                    $sub = Subscription::factory()->activa()->create([
                        'client_id' => $client->id,
                    ]);
                    break;
            }

            // Asignar entrenador solo si la suscripción está vigente y el plan lo incluye
            $incluyeEntrenador = !$sub->trashed()
                && in_array($sub->estado, ['activa', 'pendiente'])
                && $sub->plan?->incluye_entrenador;

            $client->update([
                'trainer_id' => $incluyeEntrenador ? $asignarTrainer() : null,
            ]);
        }
    }
}
