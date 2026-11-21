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
import { ArrowLeft, Pencil, Mail, Phone, Award, UserCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Plan {
    id: number;
    nombre: string;
    incluye_entrenador: boolean;
}

interface ActiveSubscription {
    id: number;
    plan?: Plan;
}

interface Trainer {
    id: number;
    employee?: {
        user?: User;
    };
}

interface Client {
    id: number;
    user_id: number;
    telefono: string | null;
    user: User;
    active_subscription?: ActiveSubscription | null;
    trainer?: Trainer | null;
}

interface ShowProps {
    cliente: Client;
}

export default function Show({ cliente }: ShowProps) {
    const planActivo = cliente?.active_subscription?.plan;
    const entrenador = cliente?.trainer?.employee?.user;
    const tieneSuscripcionActiva = Boolean(planActivo);
    const { can } = useAuth();

    return (
        <>
            <Head title={`Cliente: ${cliente?.user?.name || ""}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalles del Cliente
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Información personal, estado de suscripción y
                                asignación de entrenador.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/clientes">
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
                                        Cliente #{cliente?.id}
                                    </span>
                                    <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                        {cliente?.user?.name ||
                                            "No especificado"}
                                    </CardTitle>
                                </div>

                                {/* Badge de Estado de Suscripción */}
                                <Badge
                                    variant={
                                        tieneSuscripcionActiva
                                            ? "default"
                                            : "secondary"
                                    }
                                    className={`w-fit gap-1.5 font-medium px-3 py-1 ${
                                        tieneSuscripcionActiva
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-100"
                                    }`}
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${
                                            tieneSuscripcionActiva
                                                ? "bg-emerald-500"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                    {tieneSuscripcionActiva
                                        ? "Suscripción activa"
                                        : "Sin suscripción activa"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Grilla de Datos de Contacto */}
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
                                        {cliente?.user?.email ||
                                            "Sin correo registrado"}
                                    </p>
                                </div>

                                {/* Teléfono de Contacto */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Teléfono de Contacto
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {cliente?.telefono || "Sin registrar"}
                                    </p>
                                </div>
                            </div>

                            {/* Grilla de Información de Membresía y Entrenador */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Plan Activo */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Plan Activo
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {planActivo?.nombre ||
                                            "Sin suscripción activa"}
                                    </p>
                                </div>

                                {/* Entrenador Personal */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Entrenador Personal
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {entrenador?.name ||
                                            "Sin entrenador asignado"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>

                        {/* Pie de Tarjeta con Acción Principal */}
                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                            {can("editar cliente") && (
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                >
                                    <Link
                                        href={`/clientes/${cliente?.id}/edit`}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Editar Cliente
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
