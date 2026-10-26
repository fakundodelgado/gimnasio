import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Client {
    id: number;
    user_id: number;
    telefono: string | null;
    user: User;
}

interface IndexProps {
    clientes: Client[];
}

export default function Index({ clientes }: IndexProps) {
    const handleDelete = (id: number) => {
        if (confirm('¿Está seguro de eliminar este cliente?')) {
            router.delete(`/clientes/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Clientes" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
                    <Link
                        href="/clientes/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Nuevo Cliente
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 font-semibold">Nombre</th>
                                <th className="p-3 font-semibold">Correo Electrónico</th>
                                <th className="p-3 font-semibold">Teléfono</th>
                                <th className="p-3 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        No hay clientes registrados.
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-900">
                                            {cliente.user?.name}
                                        </td>
                                        <td className="p-3 text-gray-600">{cliente.user?.email}</td>
                                        <td className="p-3 text-gray-600">
                                            {cliente.telefono || 'Sin registrar'}
                                        </td>
                                        <td className="p-3 text-right flex justify-end gap-3">
                                            <Link
                                                href={`/clientes/${cliente.id}`}
                                                className="text-green-600 hover:underline font-medium"
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/clientes/${cliente.id}/edit`}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(cliente.id)}
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