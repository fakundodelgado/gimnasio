<?php

use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // El mismo problema que tuvimos en clase con profesores, se pluraliza mal las rutas... pero bueno, con eso todo funciona.
    Route::resource('planes', PlanController::class)->parameters([
    'planes' => 'plan']);
});

require __DIR__.'/settings.php';
