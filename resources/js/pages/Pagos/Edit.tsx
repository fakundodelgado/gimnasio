import React, { FormEvent, ChangeEvent } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface User {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio?: number | string;
}

interface Client {
    id: number;
    user?: User;
}

interface Subscription {
    id: number;
    plan?: Plan;
    client?: Client;
}

interface Payment {
    id: number;
    monto: number | string;
    fecha_pago: string;
    subscription_id: number;
    employee_id: number;
    metodo_pago: string;
    employee?: Employee;
    subscription?: Subscription;
}

interface Props {
    pago: Payment;
    suscripciones: Subscription[];
}

export default function Edit({ pago, suscripciones }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        subscription_id: String(pago.subscription_id || ""),
        metodo_pago: pago.metodo_pago || "efectivo",
    });

    const precioPlanActual = Number(pago.subscription?.plan?.precio || 0);
    const esPagoCompleto =
        precioPlanActual > 0 && Number(pago.monto) >= precioPlanActual;

    const opcionesSuscripciones = suscripciones.map((s) => {
        const clientName =
            s.client?.user?.name || `Cliente #${s.client?.id || s.id}`;
        const planName = s.plan?.nombre || "Plan N/A";
        return {
            id: s.id,
            label: `#${s.id} - ${clientName} (${planName})`,
        };
    });

    const suscripcionActualLabel =
        opcionesSuscripciones.find(
            (op) => String(op.id) === String(pago.subscription_id),
        )?.label || `#${pago.subscription_id}`;

    const cambioSuscripcion =
        String(data.subscription_id) !== String(pago.subscription_id);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/pagos/${pago.id}`);
    };

    return (
        <>
            <Head title={`Editar Pago #${pago.id}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Pago #{pago.id}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Actualizá el método de pago o la suscripción
                                asociada cuando corresponda.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/pagos">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-5 bg-white">
                                {/* Empleado Auditado (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Registrado por (Empleado):
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {pago.employee?.user
                                            ? `#${pago.employee.id} - ${pago.employee.user.name}`
                                            : "Sin empleado registrado"}
                                    </p>
                                </div>

                                {/* Fecha de Pago Original (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Pago:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {pago.fecha_pago}
                                    </p>
                                </div>

                                {/* Buscador de Suscripción (bloqueado si es pago por el 100% del plan) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Suscripción:
                                    </label>
                                    {esPagoCompleto ? (
                                        <>
                                            <p className="text-sm font-bold text-gray-900">
                                                {suscripcionActualLabel}
                                            </p>
                                            <p className="text-sm text-gray-500 italic">
                                                Este pago cubre el 100% del plan
                                                y no puede reasignarse a otra
                                                suscripción.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <SelectBuscador
                                                options={opcionesSuscripciones}
                                                value={data.subscription_id}
                                                onChange={(id) =>
                                                    setData(
                                                        "subscription_id",
                                                        String(id),
                                                    )
                                                }
                                                placeholder="Buscar por boleta o cliente..."
                                                error={errors.subscription_id}
                                            />
                                            {errors.subscription_id && (
                                                <p className="text-sm text-red-600 mt-1">
                                                    {errors.subscription_id}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Monto (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Monto:
                                    </label>
                                    {cambioSuscripcion ? (
                                        <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-indigo-900">
                                            Se recalculará automáticamente según
                                            el saldo de la nueva suscripción.
                                        </div>
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900">
                                            ${Number(pago.monto).toFixed(2)}
                                        </p>
                                    )}
                                </div>

                                {/* Método de Pago */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Método de Pago:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.metodo_pago}
                                            onChange={(
                                                e: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setData(
                                                    "metodo_pago",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="efectivo">
                                                Efectivo
                                            </option>
                                            <option value="tarjeta">
                                                Tarjeta
                                            </option>
                                            <option value="transferencia">
                                                Transferencia
                                            </option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.metodo_pago && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.metodo_pago}
                                        </p>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Actualizando..."
                                        : "Actualizar Pago"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/pagos">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
