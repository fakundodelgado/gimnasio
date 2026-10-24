<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Client;
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
        $planes = Plan::all();


        if ($planes->isNotEmpty() && $clientes->isNotEmpty()) {
            Subscription::factory(15)->activa()->create([
                'client_id' => fn () => $clientes->random()->id,
                'plan_id'   => fn () => $planes->random()->id,
            ]);
        }

        if ($planes->isNotEmpty() && $clientes->isNotEmpty()) {
            Subscription::factory(15)->vencida()->create([
                'client_id' => fn () => $clientes->random()->id,
                'plan_id'   => fn () => $planes->random()->id,
            ]);
        }

        if ($planes->isNotEmpty() && $clientes->isNotEmpty()) {
            Subscription::factory(3)->cancelada()->create([
                'client_id' => fn () => $clientes->random()->id,
                'plan_id'   => fn () => $planes->random()->id,
            ]);
        }
    }
}
