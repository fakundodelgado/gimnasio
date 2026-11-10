<?php

use App\Http\Controllers\PlanController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\IngresoController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ClientDashboardController;
use Illuminate\Support\Facades\Auth;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {

    Route::middleware(['auth'])->get('/dashboard', function () {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasRole('admin') || $user->hasRole('super')) {
            return redirect()->route('administradores.dashboard');
        }

        if ($user->hasRole('client')) {
            return redirect()->route('clientes.dashboard');
        }

        // Por seguridad, si no tiene ningún rol asignado
        return redirect('/');
    })->name('dashboard');

    Route::middleware(['auth', 'role:admin|super'])->group(function () {
        Route::get('/administradores/dashboard', [AdminDashboardController::class, 'index'])->name('administradores.dashboard');
    });

    Route::middleware(['auth', 'role:client'])->group(function () {
        Route::get('/clientes/dashboard', [ClientDashboardController::class, 'index'])->name('clientes.dashboard');
    });

    // El mismo problema que tuvimos en clase con profesores, se pluraliza mal las rutas... pero bueno, con eso todo funciona.
    Route::get('/pagos/export', [
        PaymentController::class,
        'export'
    ])->name('pagos.export');

    Route::get('pagos/pdf', [PaymentController::class, 'pdf'])->name('pagos.pdf');

    Route::resource('planes', PlanController::class)
        ->parameters(['planes' => 'plan']);

    Route::resource('clientes', ClientController::class);

    Route::resource('empleados', EmployeeController::class);

    Route::resource('entrenadores', TrainerController::class)
        ->parameters(['entrenadores' => 'entrenador']);

    Route::resource('suscripciones', SubscriptionController::class)
        ->parameters(['suscripciones' => 'suscripcion']);

    Route::resource('pagos', PaymentController::class);
    //->parameters(['pagos' => 'pago']);
    Route::resource('ingresos', IngresoController::class)->only(['index', 'create', 'store']);
});

require __DIR__ . '/settings.php';
