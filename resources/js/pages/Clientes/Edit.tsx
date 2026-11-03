import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

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
}

export default function Edit({ cliente, entrenadores = [] }: EditProps) {
    const planActivo = cliente?.active_subscription?.plan;
    const permiteEntrenador = planActivo?.incluye_entrenador ?? false;

    const { data, setData, put, processing, errors } = useForm({
        name: cliente?.user?.name || "",
        email: cliente?.user?.email || "",
        password: "",
        telefono: cliente?.telefono || "",
        trainer_id: cliente?.trainer_id || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/clientes/${cliente.id}`);
    };

    return (
        <>
            <Head title={`Editar Cliente: ${cliente?.user?.name || ""}`} />

            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Editar Cliente</h1>
                    <Link
                        href="/clientes"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Volver al listado
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 shadow rounded-lg space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña (Opcional)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Dejar vacía para conservar"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono de Contacto
                            </label>
                            <input
                                type="text"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData("telefono", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.telefono && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.telefono}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Bloque adaptado de Asignación de Entrenador */}
                    <div className="pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Entrenador Asignado
                        </label>

                        {permiteEntrenador ? (
                            <select
                                value={data.trainer_id}
                                onChange={(e) =>
                                    setData("trainer_id", e.target.value)
                                }
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Sin Entrenador --</option>
                                {entrenadores.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.employee?.user?.name ||
                                            `Entrenador #${t.id}`}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                                {planActivo ? (
                                    <p>
                                        El plan actual (
                                        <strong>{planActivo.nombre}</strong>) no
                                        incluye entrenador personal.
                                    </p>
                                ) : (
                                    <p>
                                        El cliente no posee una suscripción
                                        activa para asignarle entrenador.
                                    </p>
                                )}
                            </div>
                        )}
                        {errors.trainer_id && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.trainer_id}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/clientes"
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing
                                ? "Actualizando..."
                                : "Actualizar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
