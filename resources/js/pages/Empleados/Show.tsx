import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Mail, Phone, IdCard, Calendar } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    created_at: string;
    user: User;
}

interface ShowProps {
    empleado: Employee;
}

export default function Show({ empleado }: ShowProps) {
    const fechaAlta = empleado?.created_at
        ? new Date(empleado.created_at).toLocaleDateString("es-AR")
        : "No registrada";

    return (
        <>
            <Head title={`Empleado: ${empleado?.user?.name || ""}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalles del Empleado
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Información laboral, identificación y datos de
                                contacto del empleado.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/empleados">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    {/* Tarjeta Principal de Shadcn */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                        Empleado #{empleado?.id}
                                    </span>
                                    <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                        {empleado?.user?.name ||
                                            "No especificado"}
                                    </CardTitle>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="w-fit gap-1.5 font-medium px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Personal activo
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Grilla de Identificación y Contacto */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* CUIL */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <IdCard className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            CUIL
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {empleado?.cuil || "Sin registrar"}
                                    </p>
                                </div>

                                {/* Teléfono */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Teléfono
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {empleado?.telefono || "Sin registrar"}
                                    </p>
                                </div>

                                {/* Correo Electrónico */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Correo Electrónico
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 break-all">
                                        {empleado?.user?.email ||
                                            "Sin correo registrado"}
                                    </p>
                                </div>

                                {/* Fecha de Alta */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Fecha de Registro
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {fechaAlta}
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        {/* Pie de Tarjeta con Acción Principal */}
                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                asChild
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                            >
                                <Link href={`/empleados/${empleado?.id}/edit`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar Empleado
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
