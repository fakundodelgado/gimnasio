import React from "react";
import { Head, Link, router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    user: User;
}

interface Trainer {
    id: number;
    especialidad: string;
    employee: Employee;
}

interface Props {
    entrenadores: Trainer[];
    flash?: {
        success?: string;
    };
}

export default function Index({ entrenadores, flash }: Props) {
    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este entrenador?")) {
            router.delete(`/entrenadores/${id}`);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Head title="Entrenadores" />

            {flash?.success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    {flash.success}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Listado de Entrenadores
                </h1>
                <Link
                    href="/entrenadores/create"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow"
                >
                    + Nuevo Entrenador
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                CUIL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Teléfono
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Especialidad
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {entrenadores.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No hay entrenadores registrados.
                                </td>
                            </tr>
                        ) : (
                            entrenadores.map((entrenador) => (
                                <tr key={entrenador.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {entrenador.employee?.user?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {entrenador.employee?.user?.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {entrenador.employee?.cuil}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {entrenador.employee?.telefono}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {entrenador.especialidad}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link
                                            href={`/entrenadores/${entrenador.id}`}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            href={`/entrenadores/${entrenador.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(entrenador.id)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
