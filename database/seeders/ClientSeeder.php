<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {

        User::factory(30)->create()->each(function ($user) {

            $user->assignRole('client');

            Client::factory()->create(['user_id' => $user->id]);
        });
    }
}
