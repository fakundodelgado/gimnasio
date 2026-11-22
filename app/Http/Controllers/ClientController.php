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

        $user = $request->user();

        $buscarTexto = trim((string) $request->input('buscar_texto', ''));
        $buscarNumero = trim((string)$request->input('buscar_numero', ''));
        $buscarEntrenador = trim((string) $request->input('buscar_entrenador', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $papelera = $request->input('papelera', 'sin_eliminados');
        $estado = trim((string) $request->input('estado', ''));
        $paginas = (int) $request->input('paginas', 5);

        $esAdmin = $request->user()->hasAnyRole(['admin', 'super']);

        $camposPermitidos = ['nombre', 'id', 'created_at'];

        if (!in_array($orden, $camposPermitidos, true)) {
            $orden = 'id';
        }

        if (!in_array($paginas, [5, 10, 20], true)) {
            $paginas = 5;
        }

        if (!in_array($direccion, ['asc', 'desc'], true)) {
            $direccion = 'asc';
        }

        if (!in_array($estado, ['', 'activa', 'pendiente', 'vencida', 'cancelada', 'sin_suscripcion'], true)) {
            $estado = '';
        }

        // Anteriormente use otras cadenas para designar estos estados pero estas nuevas me parecen mas descriptivas y las usare para filtro de ahora en adelante.
        if (!$esAdmin) {
            $papelera = 'sin_eliminados'; // Las posibiliades serian sin_eliminados, con_eliminados, solo_eliminados
        }

        if (!in_array($papelera, ['sin_eliminados', 'solo_eliminados', 'con_eliminados'], true)) {
            $papelera = 'sin_eliminados';
        }

        $query = Client::with([
            'user' => fn($q) => $q->withTrashed(), // Me sirve para traer los clientes borrados (junto con los user) de ser necesario
            'ultimaSuscripcion.plan',
            'trainer.employee.user',
        ]);

        $query->when($papelera === 'con_eliminados', function ($q) {
            $q->withTrashed();
        });

        // Aqui debe ir si o si function
        $query->when($papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        });

        // Busco dentro de los campos de user, para eso debo usar whereHas y para buscar sobre dos campos distintos y usar el orWhere debo de agruparlos dentro de una misma funcion
        $query->when($buscarTexto !== '', function ($q) use ($buscarTexto) {
            $q->whereHas('user', function ($userQ) use ($buscarTexto) {
                $userQ->withTrashed()->where(function ($subQ) use ($buscarTexto) {
                    $subQ->where('name', 'like', "%{$buscarTexto}%")
                        ->orWhere('email', 'like', "%{$buscarTexto}%");
                });
            });
        });

        // Aqui solo accedo a cosas de cliente asi que no tengo necesidad de hacer un whereHas para buscar dentro de otra entidad
        $query->when($buscarNumero !== '', function ($q) use ($buscarNumero) {
            $q->where(function ($subQ) use ($buscarNumero) {
                $subQ->where('clients.telefono', 'like', "%{$buscarNumero}%")
                    ->orWhere('clients.id', 'like', "%{$buscarNumero}%");
            });
        });

        $query->when($estado !== '', function ($q) use ($estado) {
            if ($estado === 'sin_suscripcion') {
                $q->whereDoesntHave('ultimaSuscripcion');
            } else {
                $q->whereHas('ultimaSuscripcion', function ($subQ) use ($estado) {
                    $subQ->where('estado', $estado);
                });
            }
        });

        // De ser un entrenador solo debo mostrar sus alumnos (clientes)
        if ($user->hasRole('trainer')) {
            $query->where('clients.trainer_id', $user->employee->trainer->id);
        } else {
            // Sino buscare todos los alumnos que apunten a dicho entrenador (por el cual estoy buscando, usare el id para ser más rapido)
            $query->when($buscarEntrenador !== '', function ($q) use ($buscarEntrenador) {
                if ($buscarEntrenador === 'sin_entrenador') {
                    $q->whereNull('clients.trainer_id');
                } else {
                    $q->where('clients.trainer_id', $buscarEntrenador);
                }
            });
        }

        if ($orden === 'nombre') {
            $query->join('users', 'clients.user_id', '=', 'users.id')
                ->select('clients.*')
                ->orderBy('users.name', $direccion);
        } else {
            $query->orderBy("clients.{$orden}", $direccion);
        }

        $query->orderBy('clients.id', 'asc');
        $clientes = $query->paginate($paginas)->withQueryString();

        // Si el usuario es trainer no traigo los entrenadores, sino obviamente si.
        $entrenadores = $user->hasRole('trainer')
            ? []
            : Trainer::with(['employee.user'])->get();


        return Inertia::render('Clientes/Index', [
            'clientes' => $clientes,
            'filtros' => [
                'buscar_texto' => $buscarTexto,
                'buscar_numero' => $buscarNumero,
                'buscar_entrenador' => $buscarEntrenador,
                'orden' => $orden,
                'direccion' => $direccion,
                'papelera' => $papelera,
                'estado' => $estado,
                'paginas' => $paginas
            ],
            'entrenadores' => $entrenadores,
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
        $entrenadores = Trainer::with('employee.user')
            ->withCount('clients') // Cuenta cuántos clientes tienen su id en la columna client.trainer_id
            ->get();

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

    #[Middleware('permission:restaurar cliente')]
    public function restore(Client $cliente, UserService $userService)
    {
        DB::transaction(function () use ($cliente, $userService) {

            $cliente->restore();

            $user = $cliente->user()->withTrashed()->first();
            if ($user) {
                $userService->restoreUser($user);
            }
        });

        return redirect()->route('clientes.index')->with('success', 'Cliente restaurado correctamente.');
    }
}
