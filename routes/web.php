<?php

use App\Http\Controllers\PlanController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TurnController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TrainerController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // El mismo problema que tuvimos en clase con profesores, se pluraliza mal las rutas... pero bueno, con eso todo funciona.
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
    Route::resource('turnos', TurnController::class);
});

require __DIR__.'/settings.php';


