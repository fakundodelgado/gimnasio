import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface Plan {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracion: number;
    subscriptions_count?: number;
}

interface IndexProps {
    planes: Plan[];
}

export default function Index({ planes }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este plan?')) {
            router.delete(`/planes/${id}`);
        }
    };

    return (
        <>
            <Head title="Planes" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Planes</h1>
                    <Link
                        href="/planes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Nuevo Plan
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 font-semibold">Nombre</th>
                                <th className="p-3 font-semibold">Precio</th>
                                <th className="p-3 font-semibold">Duración (días)</th>
                                <th className="p-3 font-semibold">Alumnos Activos</th>
                                <th className="p-3 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No hay planes registrados.
                                    </td>
                                </tr>
                            ) : (
                                planes.map((plan) => (
                                    <tr key={plan.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{plan.nombre}</td>
                                        <td className="p-3">${plan.precio}</td>
                                        <td className="p-3">{plan.duracion}</td>
                                        <td className="p-3">{plan.subscriptions_count ?? 0}</td>
                                        <td className="p-3 text-right flex justify-end gap-3">
                                            <Link
                                                href={`/planes/${plan.id}`}
                                                className="text-green-600 hover:underline font-medium"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/planes/${plan.id}/edit`}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="text-red-600 hover:underline font-medium"
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
        </>
    );
}
