import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Plan {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracion: number;
    subscriptions_count?: number;
}

interface ShowProps {
    plan: Plan;
}

export default function Show({ plan }: ShowProps) {
    return (
        <>
            <Head title={`Plan: ${plan.nombre}`} />

            <div className="max-w-2xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Detalles del Plan</h1>
                    <Link
                        href="/planes"
                        className="text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Volver al listado
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div>
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Nombre del Plan
                        </h2>
                        <p className="text-lg font-medium text-gray-900 mt-1">{plan.nombre}</p>
                    </div>

                    <div>
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Descripción
                        </h2>
                        <p className="text-gray-700 mt-1">
                            {plan.descripcion || 'Sin descripción registrada.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-md">
                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Precio
                            </h2>
                            <p className="text-xl font-bold text-gray-900 mt-1">${plan.precio}</p>
                        </div>

                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Duración
                            </h2>
                            <p className="text-xl font-bold text-gray-900 mt-1">
                                {plan.duracion} días
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Alumnos Activos
                            </h2>
                            <p className="text-xl font-bold text-blue-600 mt-1">
                                {plan.subscriptions_count ?? 0}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link
                            href={`/planes/${plan.id}/edit`}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                        >
                            Editar Plan
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}