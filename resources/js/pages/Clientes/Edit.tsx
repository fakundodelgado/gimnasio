import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Plan {
    id: number;
    nombre: string;
    incluye_entrenador: boolean;
}

interface ActiveSubscription {
    id: number;
    plan?: Plan;
}

interface Trainer {
    id: number;
    especialidad?: string;
    clients_count?: number; // Conteo traído con withCount('clients') desde el controlador
    employee?: {
        user?: User;
    };
}

interface Client {
    id: number;
    user_id: number;
    telefono: string | null;
    trainer_id: number | null;
    user: User;
    active_subscription?: ActiveSubscription | null;
}

interface EditProps {
    cliente: Client;
    entrenadores?: Trainer[];
    esCliente: boolean;
}

const CUPO_MAXIMO_POR_ENTRENADOR = 10;

export default function Edit({
    cliente,
    entrenadores = [],
    esCliente,
}: EditProps) {
    const planActivo = cliente?.active_subscription?.plan;
    const permiteEntrenador = planActivo?.incluye_entrenador ?? false;
    const { can } = useAuth();
    const link = can("listar clientes") ? "/clientes" : "/dashboard";
    const { data, setData, put, processing, errors } = useForm({
        name: cliente?.user?.name || "",
        email: cliente?.user?.email || "",
        password: "",
        telefono: cliente?.telefono || "",
        trainer_id: cliente?.trainer_id ? String(cliente?.trainer_id) : "",
    });

    // Mapeo respetando la interfaz de SelectBuscador (id, label, disabled)
    const opcionesEntrenadores = entrenadores.map((t) => {
        const esElEntrenadorActual =
            String(cliente?.trainer_id) === String(t.id);
        const clientesAsignados = t.clients_count ?? 0;

        // Deshabilita si superó el cupo y NO es su entrenador actual
        const sinCupo =
            clientesAsignados >= CUPO_MAXIMO_POR_ENTRENADOR &&
            !esElEntrenadorActual;

        const nombre = t.employee?.user?.name || `Entrenador #${t.id}`;
        const textoCupo = sinCupo
            ? `(SIN CUPO - ${clientesAsignados}/${CUPO_MAXIMO_POR_ENTRENADOR})`
            : `(${clientesAsignados}/${CUPO_MAXIMO_POR_ENTRENADOR} cupos)`;

        return {
            id: t.id,
            label: `#${t.id} - ${nombre} ${textoCupo}`,
            disabled: sinCupo,
        };
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/clientes/${cliente.id}`);
    };

    return (
        <>
            <Head title={`Editar Cliente: ${cliente?.user?.name || ""}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Cliente
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Actualizá los datos personales, contacto o
                                entrenador de{" "}
                                <span className="font-medium text-gray-700">
                                    {cliente?.user?.name ||
                                        `Cliente #${cliente?.id}`}
                                </span>
                                .
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href={link}>
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
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="juan.perez@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Contraseña (Opcional)
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Ingrese nueva contraseña..."
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1.5">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) =>
                                                setData(
                                                    "telefono",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Ej. 3874123456"
                                        />
                                        {errors.telefono && (
                                            <p className="text-sm text-red-600 mt-1.5">
                                                {errors.telefono}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Bloque de Asignación de Entrenador con SelectBuscador */}
                                {!esCliente && (
                                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                        <label className="block text-base font-medium text-gray-700">
                                            Entrenador Asignado
                                        </label>

                                        {permiteEntrenador ? (
                                            <SelectBuscador
                                                options={opcionesEntrenadores}
                                                value={data.trainer_id}
                                                onChange={(id) =>
                                                    setData(
                                                        "trainer_id",
                                                        id ? String(id) : "",
                                                    )
                                                }
                                                placeholder="Buscar entrenador por ID o nombre..."
                                                error={errors.trainer_id}
                                            />
                                        ) : (
                                            <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg px-4 py-3 text-sm text-amber-900">
                                                {planActivo ? (
                                                    <p>
                                                        El plan actual (
                                                        <strong>
                                                            {planActivo.nombre}
                                                        </strong>
                                                        ) no incluye entrenador
                                                        personal.
                                                    </p>
                                                ) : (
                                                    <p>
                                                        El cliente no posee una
                                                        suscripción activa para
                                                        asignarle entrenador.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {errors.trainer_id && (
                                            <p className="text-sm text-red-600 mt-1.5">
                                                {errors.trainer_id}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Actualizando..."
                                        : "Actualizar Cliente"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href={link}>Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
