<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Trainer;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Routing\Attributes\Controllers\Middleware;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    #[Middleware('permission:listar clientes')]
    public function index(Request $request)
    {

        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        $camposPermitidos = ['id', 'nombre', 'created_at'];
        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($porPagina, [5, 10, 20], true)) {
            $porPagina = 5;
        }

        $user = $request->user();
        $esAdmin = $user->hasRole(['admin', 'super']);

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        $query = Client::with([
            'user' => fn($q) => $q->withTrashed(),
            'ultimaSuscripcion.plan',
            'trainer.employee.user'
        ]);

        $query->when($esAdmin && $papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($esAdmin && $papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        $query->when($buscar !== '', function ($q) use ($buscar) {
            $q->where(function ($subQ) use ($buscar) {
                if (is_numeric($buscar)) {
                    $subQ->where('clients.id', $buscar);
                }
                $subQ->orWhereHas('user', function ($userQuery) use ($buscar) {
                    $userQuery->withTrashed()
                        ->where(function ($uQ) use ($buscar) {
                            $uQ->where('name', 'like', "%{$buscar}%")
                                ->orWhere('email', 'like', "%{$buscar}%");
                        });
                });
            });
        });

        if ($orden === 'nombre') {
            $query->join('users', 'clients.user_id', '=', 'users.id')
                ->orderBy('users.name', $direccion)
                ->select('clients.*');
        } else {
            $query->orderBy("clients.{$orden}", $direccion);
        }

        $clientes = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filtros' => [
                'buscar'     => $buscar,
                'orden'      => $orden,
                'direccion'  => $direccion,
                'por_pagina' => $porPagina,
                'papelera'   => $papelera,
            ],
            'esAdmin' => $esAdmin,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */

    #[Middleware('permission:crear cliente')]
    public function create()
    {
        return Inertia::render('Clientes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */

    #[Middleware('permission:crear cliente')]
    public function store(StoreClientRequest $request, UserService $userService)
    {

        DB::transaction(function () use ($request, $userService) {

            $user = $userService->createUser($request->validated(), 'client');

            $user->client()->create([
                'telefono'   => $request->telefono,
                'trainer_id' => null, // El cliente inicia sin entrenador hasta que un plan o admin se lo asigne
            ]);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente creado correctamente.');
    }

    /**
     * Display the specified resource.
     */

    #[Middleware('permission:mostrar cliente')]
    public function show(Client $cliente)
    {
        $cliente->load(['user', 'trainer.employee.user', 'activeSubscription.plan']);

        return Inertia::render('Clientes/Show', ['cliente' => $cliente]);
    }

    /**
     * Show the form for editing the specified resource.
     */

    #[Middleware('permission:editar cliente')]
    public function edit(Client $cliente)
    {

        $cliente->load(['user', 'trainer.employee.user', 'activeSubscription.plan']);

        $entrenadores = Trainer::with('employee.user')->get();

        return Inertia::render('Clientes/Edit', [
            'cliente'      => $cliente,
            'entrenadores' => $entrenadores,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    #[Middleware('permission:editar cliente')]
    public function update(UpdateClientRequest $request, Client $cliente, UserService $userService)
    {

        $user = $request->user();
        $esAdmin = $user->hasRole(['admin', 'super']);

        if ($esAdmin && $request->filled('trainer_id')) {
            $planActivo = $cliente->activeSubscription?->plan;

            if (!$planActivo || !$planActivo->incluye_entrenador) {
                return redirect()->back()->withErrors([
                    'trainer_id' => 'El cliente no posee un plan activo que incluya entrenador.'
                ]);
            }
        }

        DB::transaction(function () use ($request, $cliente, $userService, $esAdmin) {

            $userService->updateUser($cliente->user, $request->validated());

            $datosCliente = [
                'telefono' => $request->telefono,
            ];

            if ($esAdmin && $request->has('trainer_id')) {
                $datosCliente['trainer_id'] = $request->trainer_id;
            }

            $cliente->update($datosCliente);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */

    #[Middleware('permission:eliminar cliente')]
    public function destroy(Client $cliente, UserService $userService)
    {

        DB::transaction(function () use ($cliente, $userService) {

            $user = $cliente->user;

            $cliente->delete();

            $userService->deleteUser($user);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente "eliminado" correctamente.');
    }

    // !!! Falta incluir la opción de restaurar un cliente...


}
