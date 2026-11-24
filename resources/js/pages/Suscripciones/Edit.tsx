import React, { FormEvent, ChangeEvent } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { SelectBuscador, SelectOption } from "@/components/SelectBuscador";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ChevronDown } from "lucide-react";

interface User {
    id: number;
    name: string;
    email?: string;
}

interface Client {
    id: number;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number | string;
    duracion: number;
    incluye_entrenador: boolean;
}

interface Employee {
    id: number;
    user?: User;
    cuil?: string;
}

interface Trainer {
    id: number;
    especialidad: string;
    limite_alumnos: number;
    clients_count?: number;
    employee?: Employee;
}

interface Subscription {
    id: number;
    client_id: number;
    trainer_id?: number | null;
    plan_id: number;
    precio?: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    client?: Client;
    plan?: Plan;
}

interface EditProps {
    suscripcion: Subscription;
    cliente: Client;
    plan: Plan;
    entrenadores: Trainer[];
}

export default function Edit({
    suscripcion,
    cliente,
    plan,
    entrenadores,
}: EditProps) {
    const { data, setData, put, processing, errors } = useForm<{
        trainer_id?: number | string;
        estado: string;
    }>({
        trainer_id: suscripcion?.trainer_id ?? "",
        estado: suscripcion?.estado ?? "activa",
    });

    const suscripcionEstado =
        suscripcion.estado === "activa"
            ? "Activa"
            : suscripcion.estado === "vencida"
              ? "Vencida"
              : suscripcion.estado === "cancelada"
                ? "Cancelada"
                : "Pendiente";

    const opcionesEntrenadores: SelectOption[] = entrenadores.map((tr) => {
        const esSuEntrenadorActual =
            Number(tr.id) === Number(suscripcion?.trainer_id);
        const lleno =
            !esSuEntrenadorActual &&
            (tr.clients_count ?? 0) >= tr.limite_alumnos;
        const nombre = tr.employee?.user?.name || `Entrenador #${tr.id}`;
        const cuil = tr.employee?.cuil || "Sin CUIL";

        return {
            id: tr.id,
            label: `${cuil} - ${nombre} (${tr.especialidad})`,
            sublabel: lleno
                ? "CUPO LLENO"
                : `${tr.clients_count ?? 0}/${tr.limite_alumnos} Alumnos`,
            disabled: lleno,
        };
    });

    const esVigente =
        suscripcion.estado === "activa" || suscripcion.estado === "pendiente";

    const hoy = new Date().toISOString().split("T")[0];

    const seCancelaraHoy =
        data.estado === "cancelada" && suscripcion.estado !== "cancelada";

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/suscripciones/${suscripcion.id}`);
    };

    return (
        <>
            <Head title={`Editar Suscripción #${suscripcion?.id}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Suscripción #{suscripcion?.id}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administrá el entrenador asignado o el estado de
                                vigencia de esta suscripción.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/suscripciones">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-5 bg-white">
                                {/* Cliente (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Cliente:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {cliente.user?.name}
                                    </p>
                                </div>

                                {/* Plan (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Plan Contratado:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {plan.nombre}
                                    </p>
                                </div>

                                {/* Entrenador (Editable solo si el plan lo incluye) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Entrenador:
                                    </label>
                                    {plan?.incluye_entrenador ? (
                                        <div>
                                            <SelectBuscador
                                                label=""
                                                options={opcionesEntrenadores}
                                                value={data.trainer_id}
                                                onChange={(id) =>
                                                    setData("trainer_id", id)
                                                }
                                                placeholder="Buscar por CUIL, nombre o especialidad..."
                                                error={errors.trainer_id}
                                            />
                                            {errors.trainer_id && (
                                                <p className="text-sm text-red-600 mt-1.5">
                                                    {errors.trainer_id}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">
                                            Este plan no incluye entrenador.
                                        </p>
                                    )}
                                </div>

                                {/* Fecha de Inicio (Solo Lectura) */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Inicio:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {suscripcion.fecha_inicio}
                                    </p>
                                </div>

                                {/* Fecha de Fin / Vencimiento */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Fin / Vencimiento:
                                    </label>
                                    {seCancelaraHoy ? (
                                        <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-indigo-900">
                                            {hoy} (se cortará hoy al cancelar)
                                        </div>
                                    ) : (
                                        <p className="text-sm font-bold text-gray-900">
                                            {suscripcion.fecha_fin}
                                        </p>
                                    )}
                                </div>

                                {/* Estado */}
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Estado:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.estado}
                                            onChange={(e) =>
                                                setData(
                                                    "estado",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value={suscripcion.estado}>
                                                {suscripcion.estado
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    suscripcion.estado.slice(1)}
                                            </option>
                                            {suscripcion.estado !==
                                                "cancelada" && (
                                                <option value="cancelada">
                                                    Cancelada
                                                </option>
                                            )}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>
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
                                        : "Actualizar Suscripción"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/suscripciones">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
