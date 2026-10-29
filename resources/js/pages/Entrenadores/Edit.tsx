import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

interface Props {
    entrenador: {
        id: number;
        especialidad: string;
        employee: {
            cuil: string;
            telefono: string;
            user: {
                name: string;
                email: string;
            };
        };
    };
}

export default function Edit({ entrenador }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: entrenador.employee?.user?.name || "",
        email: entrenador.employee?.user?.email || "",
        password: "",
        cuil: entrenador.employee?.cuil || "",
        telefono: entrenador.employee?.telefono || "",
        especialidad: entrenador.especialidad || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/entrenadores/${entrenador.id}`);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title="Editar Entrenador" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Editar Entrenador
                </h1>
                <Link
                    href="/entrenadores"
                    className="text-gray-600 hover:text-gray-800"
                >
                    &larr; Volver
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow rounded-lg p-6 space-y-4"
            >
                <h2 className="text-lg font-semibold border-b pb-2 text-gray-700">
                    Datos de Usuario
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña{" "}
                            <span className="text-xs text-gray-400">
                                (dejar en blanco para conservar)
                            </span>
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <h2 className="text-lg font-semibold border-b pb-2 pt-4 text-gray-700">
                    Datos del Empleado
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            CUIL
                        </label>
                        <input
                            type="text"
                            value={data.cuil}
                            onChange={(e) => setData("cuil", e.target.value)}
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        {errors.cuil && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.cuil}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            type="text"
                            value={data.telefono}
                            onChange={(e) =>
                                setData("telefono", e.target.value)
                            }
                            className="mt-1 w-full border rounded-md p-2"
                        />
                        {errors.telefono && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.telefono}
                            </p>
                        )}
                    </div>
                </div>

                <h2 className="text-lg font-semibold border-b pb-2 pt-4 text-gray-700">
                    Datos del Entrenador
                </h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Especialidad
                    </label>
                    <input
                        type="text"
                        value={data.especialidad}
                        onChange={(e) =>
                            setData("especialidad", e.target.value)
                        }
                        className="mt-1 w-full border rounded-md p-2"
                    />
                    {errors.especialidad && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.especialidad}
                        </p>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing
                            ? "Actualizando..."
                            : "Actualizar Entrenador"}
                    </button>
                </div>
            </form>
        </div>
    );
}
