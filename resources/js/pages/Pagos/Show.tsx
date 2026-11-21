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
    CreditCard,
    Receipt,
    UserCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface User {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    plan?: Plan;
}

interface Payment {
    id: number;
    monto: number | string;
    fecha_pago: string;
    metodo_pago: string;
    subscription_id: number;
    employee_id: number;
    subscription?: Subscription;
    employee?: Employee;
}

interface ShowProps {
    pago: Payment;
}

export default function Show({ pago }: ShowProps) {
    const metodoPagoTexto = pago?.metodo_pago
        ? pago.metodo_pago.toUpperCase()
        : "NO ESPECIFICADO";

    const suscripcionTexto = `Suscripción #${pago?.subscription_id ?? ""}${
        pago?.subscription?.plan?.nombre
            ? ` (${pago.subscription.plan.nombre})`
            : ""
    }`;
    const { can } = useAuth();

    const empleadoTexto =
        pago?.employee?.user?.name || `Empleado #${pago?.employee_id ?? ""}`;

    return (
        <>
            <Head title={`Pago #${pago?.id ?? ""}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Encabezado Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalle de Pago
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Información del comprobante, monto abonado y
                                medio de pago.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto bg-white"
                        >
                            <Link href="/pagos">
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
                                        Pago #{pago?.id ?? "-"}
                                    </span>
                                    <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                        $
                                        {Number(
                                            pago?.monto ?? 0,
                                        ).toLocaleString("es-AR")}
                                    </CardTitle>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="w-fit gap-1.5 font-medium px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {metodoPagoTexto}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6 bg-white">
                            {/* Grilla de Datos Principales */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Monto */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <DollarSign className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Monto
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        $
                                        {Number(
                                            pago?.monto ?? 0,
                                        ).toLocaleString("es-AR")}
                                    </p>
                                </div>

                                {/* Fecha de Pago */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Fecha de Pago
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {pago?.fecha_pago || "-"}
                                    </p>
                                </div>

                                {/* Método de Pago */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Método de Pago
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {metodoPagoTexto}
                                    </p>
                                </div>

                                {/* Empleado Registrador */}
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Empleado Registrador
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {empleadoTexto}
                                    </p>
                                </div>
                            </div>

                            {/* Suscripción Asociada */}
                            <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Receipt className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Suscripción Asociada
                                    </span>
                                </div>
                                <p className="text-base font-bold text-gray-900">
                                    {suscripcionTexto}
                                </p>
                            </div>
                        </CardContent>

                        {/* Pie de Tarjeta con Acción Principal */}
                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                            {can("editar pago") && (
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                >
                                    <Link href={`/pagos/${pago?.id}/edit`}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Editar
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
