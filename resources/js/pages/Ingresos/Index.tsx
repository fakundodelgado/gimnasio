import React from "react";
import { Head, Link } from "@inertiajs/react";

interface User {
    name: string;
}

interface Client {
    id: number;
    user?: User;
}

interface Employee {
    id: number;
    user?: User;
}

interface Ingreso {
    id: number;
    client_id: number;
    fecha_hora: string;
    client?: Client;
    employee?: Employee;
}

interface IndexProps {
    ingresos: Ingreso[];
}

export default function Index({ ingresos }: IndexProps) {
    return (
        <>
            <Head title="Historial de Accesos" />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Historial de Accesos
                        </h1>
                        <p className="text-sm text-gray-500">
                            Registro histórico de marcaciones e ingresos al
                            gimnasio
                        </p>
                    </div>

                    <Link
                        href="/ingresos/create"
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                    >
                        + Terminal de Marcación
                    </Link>
                </div>

                {/* Tabla */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b text-sm font-semibold text-gray-700">
                                <th className="p-3"># ID</th>
                                <th className="p-3">Cliente / Socio</th>
                                <th className="p-3">Fecha y Hora</th>
                                <th className="p-3">Registrado Por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingresos && ingresos.length > 0 ? (
                                ingresos.map((ingreso) => (
                                    <tr
                                        key={ingreso.id}
                                        className="border-b hover:bg-gray-50 text-sm"
                                    >
                                        <td className="p-3 font-semibold text-gray-700">
                                            #{ingreso.id}
                                        </td>
                                        <td className="p-3 font-medium text-gray-900">
                                            {ingreso.client?.user?.name ||
                                                `Cliente #${ingreso.client_id}`}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {new Date(
                                                ingreso.fecha_hora,
                                            ).toLocaleString()}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {ingreso.employee?.user?.name ||
                                                "Totem / Sistema"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No hay registros de ingresos.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
