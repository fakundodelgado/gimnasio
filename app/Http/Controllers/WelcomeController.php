<?php

namespace App\Http\Controllers;

use App\Models\Carousel;
use App\Models\Plan;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('welcome', [
            'imagenes' => Carousel::orderBy('priority')->get(),
            'planes' => Plan::orderBy('precio')->get(),
        ]);
    }
}
