<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Client;
use App\Models\Trainer;
use App\Models\Employee;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permisos = [
            // Planes
            'listar planes',
            'crear planes',
            'editar planes',
            'eliminar planes',
            // Suscripciones
            'listar suscripciones',
            'crear suscripciones',
            'cancelar suscripciones',
            'editar suscripciones',
            // Pagos 
            'listar pagos',
            'registrar pagos',
            'editar pagos',
            'eliminar pagos',
            // Turnos
            'listar turnos',
            'reservar turnos',
            'crear turnos',
            'eliminar turnos',
            'editar turnos',
            'cancelar turnos',
            // Clientes y Empleados
            'listar clientes',
            'crear clientes',
            'editar clientes',
            'eliminar clientes',
            'listar empleados',
            'gestionar empleados',
            // Roles y Permisos
            'listar roles',
            'crear roles',
            'editar roles',
            'eliminar roles',
            'listar permisos',
            'gestionar permisos',
        ];

        foreach ($permisos as $permiso) {
            Permission::findOrCreate($permiso);
        }

        $super = Role::findOrCreate('super');
        $admin = Role::findOrCreate('admin');
        $client = Role::findOrCreate('client');
        $employee = Role::findOrCreate('employee');
        $trainer = Role::findOrCreate('trainer');


        $super->givePermissionTo(Permission::all());

        $admin->givePermissionTo([
            'listar planes',
            'crear planes',
            'editar planes',
            'eliminar planes',
            'listar suscripciones',
            'crear suscripciones',
            'cancelar suscripciones',
            'editar suscripciones',
            'listar pagos',
            'registrar pagos',
            'editar pagos',
            'eliminar pagos',
            'listar turnos',
            'reservar turnos',
            'crear turnos',
            'eliminar turnos',
            'editar turnos',
            'listar clientes',
            'crear clientes',
            'editar clientes',
            'eliminar clientes',
            'listar empleados',
            'gestionar empleados',
            'listar roles',
            'crear roles',
            'editar roles',
            'eliminar roles',
        ]);

        $client->givePermissionTo([
            'listar suscripciones',
            'listar turnos',
            'reservar turnos',
            'cancelar turnos',
            'listar pagos',
        ]);

        $employee->givePermissionTo([
            'listar clientes',
            'crear clientes',
            'editar clientes',
            'listar suscripciones',
            'crear suscripciones',
            'listar pagos',
            'registrar pagos',
            'listar turnos',
            'reservar turnos',
            'cancelar turnos',
        ]);

        $trainer->givePermissionTo([
            'listar clientes',
            'listar turnos',
        ]);

        // super 
        $superUser = User::firstOrCreate(
            ['email' => 'super@gimnasio.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('12345678'),
            ]
        );
        $superUser->assignRole('super');

        // admin
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@gimnasio.com'],
            [
                'name'   => 'Administrador General',
                'password' => bcrypt('12345678'),
            ]
        );
        $adminUser->assignRole('admin');

        // employee
        $employeeUser = User::firstOrCreate(
            ['email' => 'empleado@gimnasio.com'],
            [
                'name'   => 'Laura Gómez',
                'password' => bcrypt('12345678'),
            ]
        );
        $employeeUser->assignRole('employee');

        Employee::firstOrCreate(
            ['user_id' => $employeeUser->id],
            [
                'cuil'     => '27389998882',
                'telefono' => '3874112233',
            ]
        );

        // trainer
        $trainerUser = User::firstOrCreate(
            ['email' => 'trainer@gimnasio.com'],
            [
                'name'   => 'Carlos Fitness',
                'password' => bcrypt('12345678'),
            ]
        );
        $trainerUser->assignRole('trainer');

        $trainerEmployee = Employee::firstOrCreate(
            ['user_id' => $trainerUser->id],
            [
                'cuil'     => '20351112221',
                'telefono' => '3875445566',
            ]
        );

        Trainer::firstOrCreate(
            ['employee_id' => $trainerEmployee->id],
            [
                'especialidad' => 'Musculación y Funcional',
            ]
        );

        // client
        $clientUser = User::firstOrCreate(
            ['email' => 'cliente@gimnasio.com'],
            [
                'name'   => 'Juan Pérez',
                'password' => bcrypt('12345678'),
            ]
        );
        $clientUser->assignRole('client');

        Client::firstOrCreate(
            ['user_id' => $clientUser->id],
            [
                'telefono' => '3876778899',
            ]
        );
    }
}
