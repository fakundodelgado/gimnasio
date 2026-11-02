<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Employee;
use App\Models\Subscription;
use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;


class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        Gate::authorize('viewAny', Payment::class);

        $pagos = Payment::with(['subscription.plan', 'employee.user'])->latest()->get();

        return Inertia::render('Pagos/Index', ['pagos' => $pagos]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        Gate::authorize('create', Payment::class);

        $empleados = Employee::with('user:id,name')->get();

        $suscripciones = Subscription::with(['client.user:id,name','plan:id,nombre'])->get();

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

        $suscripciones = Subscription::with(['client.user:id,name','plan:id,nombre'])->get();

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
