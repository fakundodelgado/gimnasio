<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Employee;
//use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(4)->create()->each(function ($user){

            $user->assignRole('employee');

            Employee::factory()->create(['user_id' => $user->id]);

        }
        );
    }
}
