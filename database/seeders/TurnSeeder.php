<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Trainer;
use App\Models\Turn;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TurnSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientes = Client::all();
        $entrenadores = Trainer::all();

        /* 
         *   Antes de usar la funcion anonima lo que ocurria es que se creaban 8 turnos todos con el mismo entrenador y clientes, gracias a este ajuste cada vez que se va a crear
         *   uno nuevo se vuelve a ejecutar ese random y por lo tanto pueden variar los entrenadores y clientes, aunque si tenes mala suerte van a volver a salir siempre.
         */
        
        if ($clientes->isNotEmpty() && $entrenadores->isNotEmpty()) {
            Turn::factory(8)->create([
                'trainer_id' => fn() => $entrenadores->random()->id,
                'client_id' => fn() => $clientes->random()->id
            ]);
        }
    }
}
