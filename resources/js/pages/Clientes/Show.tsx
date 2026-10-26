import React from 'react';
import { Head, Link } from '@inertiajs/react';

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

interface ShowProps {
    cliente: Client;
}

export default function Show({ cliente }: ShowProps) {
    return (
        <>
            <Head title={`Cliente: ${cliente?.user?.name || ''}`} />

            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Detalles del Cliente</h1>
                    <Link
                        href="/clientes"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Volver al listado
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Nombre Completo
                        </h2>
                        <p className="text-lg font-medium text-gray-900 mt-1">
                            {cliente?.user?.name || 'No especificado'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Correo Electrónico
                            </h2>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {cliente?.user?.email || 'Sin correo registrado'}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Teléfono de Contacto
                            </h2>
                            <p className="text-base font-semibold text-gray-900 mt-1">
                                {cliente?.telefono || 'Sin registrar'}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link
                            href={`/clientes/${cliente?.id}/edit`}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        >
                            Editar Cliente
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}