<?php

namespace Database\Seeders;
use App\Models\User;
use App\Models\Employee;
use App\Models\Trainer;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TrainerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(2)->create()->each(function ($user){

            $user->assignRole('trainer');

            $empleado = Employee::factory()->create(['user_id' => $user->id]);

            Trainer::factory()->create(['employee_id' => $empleado->id]);
        });
    }
}
