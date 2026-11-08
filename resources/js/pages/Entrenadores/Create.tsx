import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        cuil: "",
        telefono: "",
        especialidad: "",
        limite_alumnos: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/entrenadores");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <Head title="Crear Entrenador" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Registrar Nuevo Entrenador
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
                            Contraseña
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
                <div>
                    <label
                        htmlFor="limite_alumnos"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Límite de Alumnos (10 a 30)
                    </label>
                    <input
                        type="number"
                        id="limite_alumnos"
                        name="limite_alumnos"
                        min="10"
                        max="30"
                        value={data.limite_alumnos}
                        onChange={(e) =>
                            setData("limite_alumnos", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    {errors.limite_alumnos && (
                        <div className="text-red-600 text-sm mt-1">
                            {errors.limite_alumnos}
                        </div>
                    )}
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? "Guardando..." : "Guardar Entrenador"}
                    </button>
                </div>
            </form>
        </div>
    );
}
