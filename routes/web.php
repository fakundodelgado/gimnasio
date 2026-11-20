<?php

use App\Http\Controllers\PlanController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ClientDashboardController;
use App\Http\Controllers\EmployeeDashboardController;
use App\Http\Controllers\TrainerDashboardController;
use Illuminate\Support\Facades\Auth;
//use App\Models\User;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {

    Route::middleware(['auth'])->get('/dashboard', function () {
        // Dado que producto de estas redirecciones se produce un "doble direccionamiento" es de vital importancia guardar los mensajes flash ya que solo sobreviven un salto.
        session()->reflash();

        $user = Auth::user();

        if ($user->hasRole('admin') || $user->hasRole('super')) {
            return redirect()->route('administradores.dashboard');
        }

        if ($user->hasRole('client')) {
            return redirect()->route('clientes.dashboard');
        }

        if ($user->hasRole('employee')) {
            return redirect()->route('empleados.dashboard');
        }

        if ($user->hasRole('trainer')) {
            return redirect()->route('entrenadores.dashboard');
        }

        // Por seguridad, si no tiene ningún rol asignado
        return redirect('/');
    })->name('dashboard');

    // Por ahora lo dejare como grupos, pero si al fin del desarrollo no hay nuevas rutas aqui tengo que quitar el group...
    Route::middleware(['auth', 'role:admin|super'])->group(function () {
        Route::get('/administradores/dashboard', [AdminDashboardController::class, 'index'])->name('administradores.dashboard');
    });

    Route::middleware(['auth', 'role:client'])->group(function () {
        Route::get('/clientes/dashboard', [ClientDashboardController::class, 'index'])->name('clientes.dashboard');
    });

    Route::middleware(['auth', 'role:employee'])->group(function () {
        Route::get('/empleados/dashboard', [EmployeeDashboardController::class, 'index'])->name('empleados.dashboard');
    });

    Route::middleware(['auth', 'role:trainer'])->group(function () {
        Route::get('/entrenadores/dashboard', [TrainerDashboardController::class, 'index'])->name('entrenadores.dashboard');
    });

    // El mismo problema que tuvimos en clase con profesores, se pluraliza mal las rutas... pero bueno, con eso todo funciona.
    Route::get('/pagos/export', [
        PaymentController::class,
        'export'
    ])->name('pagos.export');

    Route::get('pagos/pdf', [PaymentController::class, 'pdf'])->name('pagos.pdf');

    Route::resource('planes', PlanController::class)
        ->parameters(['planes' => 'plan']);
    Route::patch('/planes/{plan}/restore', [PlanController::class, 'restore'])
        ->name('planes.restore')
        ->withTrashed();

    Route::resource('clientes', ClientController::class);
    Route::patch('/clientes/{cliente}/restore', [ClientController::class, 'restore'])
        ->name('clientes.restore')
        ->withTrashed();

    Route::resource('empleados', EmployeeController::class);
    Route::patch('/empleados/{empleado}/restore', [EmployeeController::class, 'restore'])
        ->name('empleados.restore')
        ->withTrashed();

    Route::resource('entrenadores', TrainerController::class)
        ->parameters(['entrenadores' => 'entrenador']);
    Route::patch('/entrenadores/{entrenador}/restore', [TrainerController::class, 'restore'])
        ->name('entrenadores.restore')
        ->withTrashed();

    Route::resource('suscripciones', SubscriptionController::class)
        ->parameters(['suscripciones' => 'suscripcion']);
    Route::patch('/suscripciones/{suscripcion}/restore', [SubscriptionController::class, 'restore'])
        ->name('suscripciones.restore')
        ->withTrashed();

    Route::resource('pagos', PaymentController::class);
    Route::patch('/pagos/{pago}/restore', [PaymentController::class, 'restore'])
        ->name('pagos.restore')
        ->withTrashed();
    //->parameters(['pagos' => 'pago']);
    Route::resource('ingresos', IngresoController::class)->only(['index', 'create', 'store']);

    Route::resource('roles', RoleController::class);

    Route::resource('permissions', PermissionController::class)->except([
        'show',
        'edit',
        'create'
    ]);

    Route::resource('users', UserController::class);
});

require __DIR__ . '/settings.php';
