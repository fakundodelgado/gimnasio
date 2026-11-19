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
import {
    ArrowLeft,
    Pencil,
    Mail,
    Phone,
    IdCard,
    Dumbbell,
    Users,
} from "lucide-react";

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
    user?: User;
}

interface Trainer {
    id: number;
    especialidad: string;
    limite_alumnos: number;
    employee?: Employee;
}

interface ShowProps {
    entrenador: Trainer;
    alumnos: number;
}

/*
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
        limite_alumnos: number;
    };
}
*/

export default function Show({ entrenador, alumnos }: ShowProps) {
    const nombreEntrenador =
        entrenador?.employee?.user?.name || "No especificado";
    const emailEntrenador =
        entrenador?.employee?.user?.email || "Sin correo registrado";

    return (
        <>
            <Head title={`Entrenador - ${nombreEntrenador}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Ficha del Entrenador
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Datos personales, información de contacto,
                                especialidad, cupo de alumnos y alumnos
                                actuales.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/entrenadores">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Link>
                        </Button>
                    </div>

                    {/* Tarjeta Principal de Shadcn */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                        Entrenador #{entrenador?.id}
                                    </span>
                                    <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                        {nombreEntrenador}
                                    </CardTitle>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="w-fit gap-1.5 font-medium px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {entrenador?.especialidad ||
                                        "Especialidad general"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Grilla de Datos de Contacto e Identificación */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Correo Electrónico */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Correo Electrónico
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 break-all">
                                        {emailEntrenador}
                                    </p>
                                </div>

                                {/* Contacto / Teléfono */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Contacto
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {entrenador?.employee?.telefono ||
                                            "Sin registrar"}
                                    </p>
                                </div>

                                {/* CUIL */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <IdCard className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            CUIL
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {entrenador?.employee?.cuil ||
                                            "Sin registrar"}
                                    </p>
                                </div>

                                {/* Especialidad */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Dumbbell className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Especialidad
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {entrenador?.especialidad ||
                                            "Sin especialidad registrada"}
                                    </p>
                                </div>

                                {/* Límite de Alumnos */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Límite de Alumnos
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-indigo-600">
                                        {entrenador?.limite_alumnos ?? 0}
                                    </p>
                                </div>

                                {/* Alumnos asignados */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Alumnos asignados
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-indigo-600">
                                        {alumnos}
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
                                <Link
                                    href={`/entrenadores/${entrenador?.id}/edit`}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar Información
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
