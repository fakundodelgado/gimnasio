<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Employee;
use App\Models\Subscription;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Payment::class);

        $buscar = trim($request->input('buscar', ''));
        $orden = $request->input('orden', 'id');
        $direccion = $request->input('direccion', 'asc');
        $porPagina = (int) $request->input('por_pagina', 5);
        $papelera = $request->input('papelera', 'sin_eliminados');

        $camposPermitidos = ['id', 'fecha_pago', 'monto', 'metodo_pago'];

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
        $esAdmin = $user->hasRole(['admin', 'super-admin']);
        $esCliente = $user->hasRole('client');

        if (!$esAdmin) {
            $papelera = 'sin_eliminados';
        }

        // Carga ansiosa completa incluyendo el Plan, la Suscripción y el Empleado
        $query = Payment::with([
            'subscription.client' => function ($clientQuery) {
                $clientQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            },
            'subscription.plan',
            'employee' => function ($empQuery) {
                $empQuery->withTrashed()->with([
                    'user' => function ($uQ) {
                        $uQ->withTrashed();
                    }
                ]);
            }
        ]);

        // Filtro de Papelera (Exclusivo Admin)
        $query->when($esAdmin && $papelera === 'solo_eliminados', function ($q) {
            $q->onlyTrashed();
        })
            ->when($esAdmin && $papelera === 'todos', function ($q) {
                $q->withTrashed();
            });

        // Si es cliente, solo ve los pagos de sus propias suscripciones
        $query->when($esCliente && $user->client, function ($q) use ($user) {
            $q->whereHas('subscription', function ($subQ) use ($user) {
                $subQ->where('client_id', $user->client->id);
            });
        });

        // Búsqueda Inteligente: ID de Pago, ID de Suscripción o Nombre de Cliente/Empleado
        $query->when($buscar !== '', function ($q) use ($buscar, $papelera) {
            $q->where(function ($subQ) use ($buscar, $papelera) {

                // 1. Si es numérico, busca por ID de Pago o ID de Suscripción
                if (is_numeric($buscar)) {
                    $subQ->where('payments.id', $buscar)
                        ->orWhere('payments.subscription_id', $buscar);
                }

                // 2. Coincidencia por Nombre del Cliente que realiza el pago
                $subQ->orWhereHas('subscription.client', function ($clientQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $clientQuery->withTrashed();
                    }
                    $clientQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });

                // 3. Coincidencia por Nombre del Empleado que cobró en caja
                $subQ->orWhereHas('employee', function ($empQuery) use ($buscar, $papelera) {
                    if ($papelera !== 'sin_eliminados') {
                        $empQuery->withTrashed();
                    }
                    $empQuery->whereHas('user', function ($uQuery) use ($buscar, $papelera) {
                        if ($papelera !== 'sin_eliminados') {
                            $uQuery->withTrashed();
                        }
                        $uQuery->where('name', 'like', "%{$buscar}%");
                    });
                });
            });
        });

        // Ordenamiento dinámico seguro
        $query->orderBy("payments.{$orden}", $direccion);

        // Paginación limpia
        $pagos = $query->paginate($porPagina)->withQueryString();

        return Inertia::render('Pagos/Index', [
            'pagos' => $pagos,
            'filtros' => [
                'buscar'     => $buscar,
                'orden'      => $orden,
                'direccion'  => $direccion,
                'por_pagina' => $porPagina,
                'papelera'   => $papelera,
            ],
            'esAdmin' => $esAdmin, // <--- Pasado explícitamente a React
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create', Payment::class);

        $empleados = Employee::with('user:id,name')->get();

        $suscripciones = Subscription::with(['client.user:id,name', 'plan:id,nombre'])->get();

        return Inertia::render('Pagos/Create', ['empleados' => $empleados, 'suscripciones' => $suscripciones]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {

        Gate::authorize('create', Payment::class);

        Payment::create($request->validated());

        return redirect()->route('pagos.index')->with('success', 'Pago creado correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $pago)
    {

        Gate::authorize('view', $pago);

        $pago->load(['subscription.plan', 'employee.user']);

        return Inertia::render('Pagos/Show', ['pago' => $pago]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $pago)
    {
        Gate::authorize('update', $pago);

        $empleados = Employee::with('user:id,name')->get();

        $suscripciones = Subscription::with(['client.user:id,name', 'plan:id,nombre'])->get();

        $pago->load(['subscription.plan', 'employee.user']);

        return Inertia::render('Pagos/Edit', ['pago' => $pago, 'empleados' => $empleados, 'suscripciones' => $suscripciones]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePaymentRequest $request, Payment $pago)
    {
        Gate::authorize('update', $pago);

        $pago->update($request->validated());

        return redirect()->route('pagos.index')->with('success', 'Pago actualizado con exito');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $pago)
    {
        Gate::authorize('delete', $pago);

        $pago->delete();

        return redirect()->route('pagos.index')->with('success', 'Pago eliminado correctamente');
    }
}
