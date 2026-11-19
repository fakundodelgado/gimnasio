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
    DollarSign,
    Calendar,
    UserCheck,
    Users,
} from "lucide-react";

interface Plan {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    duracion: number;
    incluye_entrenador: boolean;
    subscriptions_count?: number;
}

interface ShowProps {
    plan: Plan;
}

export default function Show({ plan }: ShowProps) {
    return (
        <>
            <Head title={`Plan: ${plan.nombre}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalles del Plan
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Información completa y métricas de suscripción
                                del plan.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/planes">
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
                                        Plan #{plan.id}
                                    </span>
                                    <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                        {plan.nombre}
                                    </CardTitle>
                                </div>

                                {/* Badge de Estado / Modalidad */}
                                <Badge
                                    variant={
                                        plan.incluye_entrenador
                                            ? "default"
                                            : "secondary"
                                    }
                                    className={`w-fit gap-1.5 font-medium px-3 py-1 ${
                                        plan.incluye_entrenador
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            plan.incluye_entrenador
                                                ? "bg-emerald-500"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                    {plan.incluye_entrenador
                                        ? "Con entrenador"
                                        : "Sin entrenador"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Descripción */}
                            <div>
                                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                    Descripción
                                </h2>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    {plan.descripcion ||
                                        "Sin descripción registrada."}
                                </p>
                            </div>

                            {/* Grilla de Métricas Responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Precio */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <DollarSign className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Precio
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        $
                                        {Number(plan.precio).toLocaleString(
                                            "es-AR",
                                        )}
                                    </p>
                                </div>

                                {/* Duración */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Duración
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {plan.duracion}{" "}
                                        {plan.duracion === 1 ? "día" : "días"}
                                    </p>
                                </div>

                                {/* Entrenador */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <UserCheck className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Entrenador
                                        </span>
                                    </div>
                                    <p className="text-base font-bold">
                                        {plan.incluye_entrenador ? (
                                            <span className="text-emerald-600">
                                                Incluido
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">
                                                No incluido
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Alumnos Activos */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Users className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Alumnos
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-indigo-600">
                                        {plan.subscriptions_count ?? 0}
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
                                <Link href={`/planes/${plan.id}/edit`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar Plan
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
