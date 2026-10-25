<?php

use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('planes', PlanController::class);
});

require __DIR__.'/settings.php';
