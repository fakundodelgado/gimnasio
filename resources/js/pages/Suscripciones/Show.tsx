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
    User,
    ClipboardList,
    DollarSign,
    Calendar,
    CalendarCheck,
} from "lucide-react";

interface User {
    id: number;
    name: string;
}

interface Client {
    id: number;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number;
}

interface Subscription {
    id: number;
    client?: Client;
    plan?: Plan;
    precio: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
}

interface ShowProps {
    suscripcion: Subscription;
}

export default function Show({ suscripcion }: ShowProps) {
    const estadoNormalizado = (suscripcion?.estado ?? "").toLowerCase();
    const estadoTexto = (suscripcion?.estado ?? "").toUpperCase();
    const esActiva = estadoNormalizado === "activa";
    const esVencida = estadoNormalizado === "vencida";
    const esCancelada = estadoNormalizado === "cancelada";

    const nombreCliente =
        suscripcion.client?.user?.name || `Cliente #${suscripcion.client?.id}`;
    const nombrePlan =
        suscripcion.plan?.nombre || `Plan #${suscripcion.plan?.id}`;

    return (
        <>
            <Head title={`Suscripción #${suscripcion.id}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalle de Suscripción
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Información del alumno, plan contratado, monto y
                                vigencia.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/suscripciones">
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
                                    <span className="text-xm font-semibold text-indigo-600 uppercase tracking-wider">
                                        Suscripción #{suscripcion.id}
                                    </span>
                                </div>

                                <Badge
                                    variant={esActiva ? "default" : "secondary"}
                                    className={`w-fit gap-1.5 font-medium px-3 py-1 ${
                                        esActiva
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                            : esVencida
                                              ? "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-50"
                                              : esCancelada
                                                ? "bg-red-100 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50"
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            esActiva
                                                ? "bg-emerald-500"
                                                : esVencida
                                                  ? "bg-gray-500"
                                                  : esCancelada
                                                    ? "bg-red-500"
                                                    : "bg-amber-500"
                                        }`}
                                    />
                                    {estadoTexto}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Grilla de Datos Principales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Cliente */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Cliente
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {nombreCliente}
                                    </p>
                                </div>

                                {/* Plan Contratado */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Plan Contratado
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {nombrePlan}
                                    </p>
                                </div>

                                {/* Precio Mantenido */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <DollarSign className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Precio Mantenido
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        $
                                        {Number(
                                            suscripcion.precio,
                                        ).toLocaleString("es-AR")}
                                    </p>
                                </div>

                                {/* Estado */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Estado
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {estadoTexto}
                                    </p>
                                </div>

                                {/* Fecha de Inicio */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Fecha de Inicio
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {suscripcion.fecha_inicio}
                                    </p>
                                </div>

                                {/* Fecha de Vencimiento */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <CalendarCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Fecha de Vencimiento
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {suscripcion.fecha_fin}
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
                                    href={`/suscripciones/${suscripcion.id}/edit`}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Editar
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
