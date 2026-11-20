import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { SelectBuscador, SelectOption } from "@/components/SelectBuscador";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Pencil,
    User,
    ChevronDown,
    ClipboardList,
    DollarSign,
    Calendar,
    CalendarCheck,
} from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
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
    cuil: string;
}

interface Trainer {
    id: number;
    especialidad: string;
    limite_alumnos: number;
    clients_count?: number;
    employee?: Employee;
}

interface CreateProps {
    clientes: Client[];
    planes: Plan[];
    entrenadores: Trainer[];
    inicio: string;
}

export default function Create({
    clientes,
    planes,
    inicio,
    entrenadores,
}: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<{
        client_id: number | string;
        trainer_id?: number | string;
        plan_id: number | string;
        estado: string;
        metodo_pago: string;
    }>({
        client_id: "",
        trainer_id: "",
        plan_id: "",
        estado: "activa",
        metodo_pago: "efectivo",
    });

    const opcionesEntrenadores: SelectOption[] = entrenadores.map((tr) => {
        const lleno = (tr.clients_count ?? 0) >= tr.limite_alumnos;
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

    const opcionesClientes: SelectOption[] = clientes.map((c) => ({
        id: c.id,
        label: `#${c.id} - ${c.user?.name || "Sin nombre"}`,
        sublabel: c.user?.email || undefined,
    }));

    const planSeleccionado = planes.find((p) => p.id === Number(data.plan_id));

    const fechaFin = () => {
        if (!planSeleccionado) {
            return "Seleccionar un plan";
        }

        const fecha = new Date(inicio);
        fecha.setDate(fecha.getDate() + planSeleccionado.duracion);
        return fecha.toISOString().split("T")[0];
    };

    const montoInicial = () => {
        if (!planSeleccionado) return null;
        const precio = Number(planSeleccionado.precio);
        return data.estado === "pendiente" ? precio / 2 : precio;
    };

    const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedPlanId = e.target.value;
        const plan = planes.find((p) => p.id === Number(selectedPlanId));

        setData((prev) => ({
            ...prev,
            plan_id: selectedPlanId,
            trainer_id: plan?.incluye_entrenador ? prev.trainer_id : "",
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/suscripciones");
    };

    const montoACobrar = montoInicial();

    return (
        <>
            <Head title="Creación de suscripciones" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Crear Nueva Suscripción
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Completá los datos para registrar una nueva
                                suscripción.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
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
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Cliente:
                                    </label>
                                    <div className="space-y-1.5">
                                        <SelectBuscador
                                            label=""
                                            options={opcionesClientes}
                                            value={data.client_id}
                                            onChange={(id) =>
                                                setData("client_id", id)
                                            }
                                            placeholder="Buscar cliente por número o nombre..."
                                            error={errors.client_id}
                                        />
                                    </div>
                                    {errors.client_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.client_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Plan:
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.plan_id}
                                            onChange={handlePlanChange}
                                            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                -- Seleccionar Plan --
                                            </option>
                                            {planes.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre} (${p.precio})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.plan_id && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.plan_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Entrenador:
                                    </label>
                                    {planSeleccionado?.incluye_entrenador ? (
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
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic py-2">
                                            {data.plan_id
                                                ? "El plan seleccionado no incluye entrenador."
                                                : "Selecciona un plan para asignar entrenador."}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Precio Total del Plan:
                                    </label>
                                    <p
                                        className={
                                            planSeleccionado
                                                ? "text-sm font-bold text-gray-900"
                                                : "text-sm text-gray-500 italic py-2"
                                        }
                                    >
                                        {planSeleccionado
                                            ? `$${Number(planSeleccionado.precio).toFixed(2)}`
                                            : "Seleccionar un plan"}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Inicio:
                                    </label>
                                    <p className="text-sm font-bold text-gray-900">
                                        {inicio}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Fecha de Vencimiento:
                                    </label>
                                    <p
                                        className={
                                            planSeleccionado
                                                ? "text-sm font-bold text-gray-900"
                                                : "text-sm text-gray-500 italic py-2"
                                        }
                                    >
                                        {fechaFin()}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Modalidad / Estado Inicial:
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            value={data.estado}
                                            onChange={(
                                                e: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setData(
                                                    "estado",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="activa">
                                                Activa (Pago completo 100%)
                                            </option>
                                            <option value="pendiente">
                                                Pendiente (Pago inicial 50%)
                                            </option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                    {errors.estado && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.estado}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Método de Pago Inicial:
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

                                {montoACobrar !== null && (
                                    <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg px-4 py-3 text-sm text-indigo-900">
                                        Se registrará automáticamente un pago
                                        inicial de ${montoACobrar.toFixed(2)}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Guardar Suscripción
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
