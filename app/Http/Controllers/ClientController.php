<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Client::class);

        $clientes = Client::with('user')->latest()->get();

        return Inertia::render('Clientes/Index', ['clientes' => $clientes]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Client::class);

        return Inertia::render('Clientes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request, UserService $userService)
    {
        Gate::authorize('create', Client::class);

        DB::transaction(function () use ($request, $userService) {

            $user = $userService->createUser($request->validated(), 'client');

            $user->client()->create([
                'telefono' => $request->telefono,
            ]);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $cliente)
    {
        Gate::authorize('view', $cliente);

        $cliente->load('user');

        return Inertia::render('Clientes/Show', ['cliente' => $cliente]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $cliente)
    {
        Gate::authorize('update', $cliente);

        $cliente->load('user');

        return Inertia::render('Clientes/Edit', ['cliente' => $cliente]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $cliente, UserService $userService)
    {
        Gate::authorize('update', $cliente);

        DB::transaction(function () use ($request, $cliente, $userService) {

            $userService->updateUser($cliente->user, $request->validated());

            $cliente->update([
                'telefono' => $request->telefono,
            ]);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $cliente, UserService $userService)
    {

        Gate::authorize('delete', $cliente); 

        DB::transaction(function () use ($cliente, $userService){
            
            $user = $cliente->user;

            $cliente->delete();
            
            $userService->deleteUser($user);

        });

        return redirect()->route('clientes.index')->with('success', 'Cliente "eliminado" correctamente.');
    }
}
