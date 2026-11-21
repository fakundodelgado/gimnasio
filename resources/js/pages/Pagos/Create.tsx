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

interface Plan {
    id: number;
    nombre: string;
}

interface Client {
    id: number;
    user?: User;
}

interface Subscription {
    id: number;
    plan?: Plan;
    client?: Client;
    precio: number;
    payments_sum_monto?: number | string | null;
}

interface Props {
    fecha: string;
    suscripciones: Subscription[];
}

export default function Create({ fecha, suscripciones }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subscription_id: "",
        metodo_pago: "efectivo",
    });

    const opcionesSuscripciones = suscripciones.map((s) => {
        const clientName =
            s.client?.user?.name || `Cliente #${s.client?.id || s.id}`;
        const planName = s.plan?.nombre || "Plan N/A";

        return {
            id: s.id,
            label: `#${s.id} - ${clientName} (${planName})`,
        };
    });

    const suscripcionSeleccionada = suscripciones.find(
        (s) => String(s.id) === String(data.subscription_id),
    );

    const saldoPendiente = suscripcionSeleccionada?.plan
        ? Math.max(
              0,
              Number(suscripcionSeleccionada.precio) -
                  Number(suscripcionSeleccionada.payments_sum_monto || 0),
          )
        : null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/pagos");
    };

    return (
        <>
            <Head title="Registrar Pago" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Registrar Nuevo Pago
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Seleccioná una suscripción pendiente y registrá
                                el cobro correspondiente.
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
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Suscripción a Pagar (Buscar por Boleta o
                                        Cliente):
                                    </label>
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
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Monto a Abonar (Saldo Pendiente
                                        Automático):
                                    </label>
                                    <p
                                        className={
                                            saldoPendiente !== null
                                                ? "text-sm font-bold text-gray-900"
                                                : "text-sm text-gray-500 italic py-2"
                                        }
                                    >
                                        {saldoPendiente !== null
                                            ? `$${saldoPendiente.toFixed(2)}`
                                            : "Seleccione una suscripción pendiente..."}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Pago:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {fecha}
                                    </p>
                                </div>

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
                                        ? "Guardando..."
                                        : "Guardar Pago"}
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
