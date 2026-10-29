import React from "react";
import { Head, Link } from "@inertiajs/react";

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

export default function Show({ entrenador }: Props) {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Head title={`Entrenador - ${entrenador.employee?.user?.name}`} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Ficha del Entrenador
                </h1>
                <Link
                    href="/entrenadores"
                    className="text-gray-600 hover:text-gray-800"
                >
                    &larr; Volver
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Datos Personales
                    </h2>
                    <div className="mt-2 text-gray-800">
                        <p className="text-lg font-bold">
                            {entrenador.employee?.user?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            {entrenador.employee?.user?.email}
                        </p>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Información Laboral
                    </h2>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-500">
                                CUIL:
                            </span>
                            <p className="text-gray-800">
                                {entrenador.employee?.cuil}
                            </p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">
                                Contacto:
                            </span>
                            <p className="text-gray-800">
                                {entrenador.employee?.telefono}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Especialidad
                    </h2>
                    <p className="mt-1 text-gray-800 font-medium">
                        {entrenador.especialidad}
                    </p>
                </div>

                <div className="border-t pt-4 flex justify-end space-x-2">
                    <Link
                        href={`/entrenadores/${entrenador.id}/edit`}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Editar Información
                    </Link>
                </div>
            </div>
        </div>
    );
}
