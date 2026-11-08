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
        // Limpio el cache de Spatie.

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // PERMISOS //

        // Defino cuales seran los permisos para mi web.

        $permisos = [

            /*
            
            Estas definiciones las hare de la forma mas generica posible, incluso a si priori y por como
            administrare por ejemplo la gestion de usuarios tantos permisos seran innecesarios, pero dado
            que tengo la intención de continuar ampliando el proyecto lo dejare de esta forma, por las dudas.
            
            */

            // No contemplare la opción del forceDelete, ya que la idea de implementar el softDelete es justamente evitar la eliminacion de registros.

            // Planes

            'listar planes',
            'mostrar plan',
            'crear plan',
            'editar plan',
            'eliminar plan',
            'restaurar plan',

            // Suscripciones/Pases

            'listar suscripciones',
            'mostrar suscripcion',
            'crear suscripcion',
            'editar suscripcion',
            'eliminar suscripcion',
            'restaurar suscripcion',

            // Pagos 

            'listar pagos',
            'mostrar pago',
            'crear pago',
            'editar pago',
            'eliminar pago',
            'restaurar pago',

            // Clientes 
            'listar clientes',
            'mostrar cliente',
            'crear cliente',
            'editar cliente',
            'eliminar cliente',
            'restaurar cliente',

            // Empleados
            'listar empleados',
            'mostrar empleado',
            'crear empleado',
            'editar empleado',
            'eliminar empleado',
            'restaurar empleado',

            // Entrenadores
            'listar entrenadores',
            'mostrar entrenador',
            'crear entrenador',
            'editar entrenador',
            'eliminar entrenador',
            'restaurar entrenador',

            // Roles
            'listar roles',
            'mostrar rol',
            'crear rol',
            'editar rol',
            'eliminar rol',
            'restaurar rol',

            // Permisos

            'listar permisos',
            'mostrar permiso',
            'crear permiso',
            'editar permiso',
            'eliminar permiso',
            'restaurar permiso',

            // Usuarios

            'listar usuarios',
            'mostrar usuario',
            'crear usuario',
            'editar usuario',
            'eliminar usuario',
            'restaurar usuario',


        ];

        // Se crean todos los permisos uno por uno.

        foreach ($permisos as $permiso) {
            Permission::findOrCreate($permiso);
        }

        // ROLES //

        // Se crean los cinco roles que tendra mi sistema en principio.

        $super = Role::findOrCreate('super'); // super-admin
        $admin = Role::findOrCreate('admin'); // admin
        $client = Role::findOrCreate('client'); // cliente
        $employee = Role::findOrCreate('employee'); // empleado
        $trainer = Role::findOrCreate('trainer'); // entrenador

        // Asignacion de permisos para cada uno de los roles.

        // Tiene absolutamente todos los permisos.

        $super->givePermissionTo(Permission::all());

        // El admin no podra crear usuarios ( por fuera de los clientes, empleados y entrenadores), roles o permisos. Esas son funciones propias del super.

        $admin->givePermissionTo([

            'listar planes',
            'mostrar plan',
            'crear plan',
            'editar plan',
            'eliminar plan',
            'restaurar plan',

            'listar suscripciones',
            'mostrar suscripcion',
            'crear suscripcion',
            'editar suscripcion',
            'eliminar suscripcion',
            'restaurar suscripcion',

            'listar pagos',
            'mostrar pago',
            'crear pago',
            'editar pago',
            'eliminar pago',
            'restaurar pago',

            'listar clientes',
            'mostrar cliente',
            'crear cliente',
            'editar cliente',
            'eliminar cliente',
            'restaurar cliente',

            'listar empleados',
            'mostrar empleado',
            'crear empleado',
            'editar empleado',
            'eliminar empleado',
            'restaurar empleado',

            'listar entrenadores',
            'mostrar entrenador',
            'crear entrenador',
            'editar entrenador',
            'eliminar entrenador',
            'restaurar entrenador',
        ]);

        // Permisos del cliente

        /*
        
        Por ahora no permitire que liste todos los entrenadores, eso en todo caso se hara en la recepcion a la hora de confirmar una suscripcion.
        Pero de momento el sistema no contempla esa posibilidad, se le asignara uno que este disponible y listo. Pero, deberia poder ver quien es y cual
        es su especialidad mediante un show.
        
        */

        $client->givePermissionTo([

            // Solo funcionan sobre si mismo
            'mostrar cliente',
            'editar cliente',
            'eliminar cliente', // Deberia de ser capaz de eliminar su cuenta por X razon.
            'restaurar cliente', // Tambien de restaurar la misma, aunque, no creo que se implemente de momento.

            // Solo su entrenador
            'mostrar entrenador',  // Tendria sentido que pueda ver el perfil de su entrenador asignado.

            // Propias.
            'listar suscripciones',
            'mostrar suscripcion',

            // Propios.
            'listar pagos',
            'mostrar pago',

            'listar planes',
            'mostrar plan',
        ]);

        // Permisos del empleado

        $employee->givePermissionTo([

            'listar clientes',
            'mostrar cliente',
            'crear cliente',
            'editar cliente',
            'eliminar cliente',
            'restaurar cliente',

            // Solo funcionan sobre si mismo
            'mostrar empleado',
            'editar empleado',

            'listar planes',
            'mostrar plan',

            'listar suscripciones',
            'mostrar suscripcion',
            'crear suscripcion',
            'editar suscripcion',
            'eliminar suscripcion',

            'listar pagos',
            'mostrar pago',
            'crear pago',
            'editar pago',

            'listar entrenadores',
            'mostrar entrenador',


        ]);

        // Si bien en la base de datos un entrenador es a la vez un empleado, la idea es separar los roles lo mas posible de momento
        $trainer->givePermissionTo([

            // Solo los que tiene asignado
            'listar clientes',
            'mostrar cliente',

            // Solo funciona sobre si mismo
            'mostrar entrenador',
            'editar entrenador',

        ]);

        // USUARIOS ESPECIALES DE PRUEBA //

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

        // Empleado fantasma con fines administrativos
        $employeeAdminUser = User::firstOrCreate(
            ['email' => 'empleadofalso@gimnasio.com'],
            [
                'name'   => 'Administracion',
                'password' => bcrypt('12345678'),
            ]
        );
        $employeeAdminUser->assignRole('employee');

        Employee::firstOrCreate(
            ['user_id' => $employeeAdminUser->id],
            [
                'cuil'     => '27389998889',
                'telefono' => '3874112239',
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
                'limite_alumnos' => 5,
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
