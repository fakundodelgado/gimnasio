<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Services\UserService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Client::class);

        // 2. Recibir y sanitizar parámetros de entrada
        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        // 3. Validar parámetros permitidos
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

        // Si NO es Admin / Super Admin, forzamos la papelera a 'sin_eliminados'
        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        // 4. Construcción de la consulta Eloquent con Query Builder
        $query = Client::with(['user' => function ($q) {
            $q->withTrashed(); // Carga la relación user incluso si sufrió Soft Delete
        }]);

        // Papelera (Exclusivo Admin / Super Admin)
        $query->when($esAdmin && $papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($esAdmin && $papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        // Búsqueda por N° Socio (ID) o por Nombre/Email en la relación User
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

        // Ordenamiento dinámico
        if ($orden === 'nombre') {
            $query->join('users', 'clients.user_id', '=', 'users.id')
                ->orderBy('users.name', $direccion)
                ->select('clients.*'); // Retorna únicamente campos del modelo Client
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

        DB::transaction(function () use ($cliente, $userService) {

            $user = $cliente->user;

            $cliente->delete();

            $userService->deleteUser($user);
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente "eliminado" correctamente.');
    }
}
