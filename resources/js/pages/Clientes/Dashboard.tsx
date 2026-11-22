import { Head, Link } from "@inertiajs/react";
import {
    Calendar,
    CreditCard,
    Dumbbell,
    DollarSign,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Plan {
    id: number;
    nombre: string;
    precio: number;
    descripcion?: string;
}

interface Subscription {
    id: number;
    estado: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    plan: Plan;
}

interface Client {
    id: number;
}

interface Trainer {
    id: number;
    nombre?: string;
    telefono?: string;
    especialidad?: string;
}

interface Payment {
    id: number;
    monto: number;
    fecha_pago: string;
    metodo_pago?: string;
}

interface ClientDashboardProps {
    usuario: {
        name: string;
        email: string;
    };
    ingresosMes: number;
    ingresosTotales: number;
    entrenador: Trainer | null;
    plan: Subscription | null;
    suscripciones: Subscription[];
    pagosCliente: Payment[];
    totalGasto: number;
    cliente: Client;
}

export default function ClientDashboard({
    usuario,
    ingresosMes = 0,
    ingresosTotales = 0,
    entrenador,
    plan,
    suscripciones = [],
    pagosCliente = [],
    totalGasto = 0,
    cliente,
}: ClientDashboardProps) {
    return (
        <>
            <Head title="Mi Panel - Gimnasio" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto space-y-6">
                    {/* Encabezado de Bienvenida */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                ¡Hola, {usuario.name}!
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Acá podés consultar el estado de tu membresía,
                                tus asistencias y tus pagos.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href={`/clientes/${cliente.id}`}>
                                    Perfil
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Tarjetas de Métricas del Cliente */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Estado del Plan */}
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Mi Plan Actual
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {plan
                                        ? plan.plan.nombre
                                        : "Sin Plan Activo"}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {plan ? (
                                        <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Activo (Vence:{" "}
                                            {plan.fecha_fin ?? "N/A"})
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-semibold inline-flex items-center gap-1">
                                            <XCircle className="h-3.5 w-3.5" />
                                            Requiere renovación
                                        </span>
                                    )}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Asistencias este mes */}
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Asistencias (Últimos 30 días)
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {ingresosMes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Total histórico: {ingresosTotales} ingresos
                                </p>
                            </CardContent>
                        </Card>

                        {/* Entrenador Asignado */}
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Mi Entrenador
                                </CardTitle>
                                <Dumbbell className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {entrenador
                                        ? entrenador.nombre
                                        : "Sin asignar"}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {entrenador
                                        ? entrenador.especialidad
                                        : "Entrenamiento General"}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Inversión Total */}
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Inversión Histórica
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    $
                                    {Number(totalGasto).toLocaleString("es-AR")}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Acumulado en pagos realizados
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección de Tablas: Historial de Pagos y Suscripciones */}
                    <div className="grid gap-4 lg:grid-cols-7">
                        {/* Historial de Pagos */}
                        <Card className="lg:col-span-4 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Mis Pagos Recientes
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Comprobantes y transacciones registradas en
                                    tu cuenta
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 bg-white">
                                <div className="overflow-x-auto">
                                    <Table className="w-full border-collapse">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Fecha
                                                </TableHead>
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Método
                                                </TableHead>
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Monto
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                            {pagosCliente.length > 0 ? (
                                                pagosCliente.map((pago) => (
                                                    <TableRow
                                                        key={pago.id}
                                                        className="hover:bg-gray-50/70"
                                                    >
                                                        <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            {new Date(
                                                                pago.fecha_pago,
                                                            ).toLocaleDateString(
                                                                "es-AR",
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                            <Badge
                                                                variant="outline"
                                                                className="capitalize bg-white text-gray-700 border-gray-300"
                                                            >
                                                                {pago.metodo_pago ??
                                                                    "Efectivo / Transferencia"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center font-semibold text-emerald-600 whitespace-nowrap">
                                                            $
                                                            {Number(
                                                                pago.monto,
                                                            ).toLocaleString(
                                                                "es-AR",
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={3}
                                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                                    >
                                                        No tenés pagos
                                                        registrados todavía.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Historial de Suscripciones */}
                        <Card className="lg:col-span-3 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Mis Membresías
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Historial de planes contratados
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 bg-white">
                                <div className="overflow-x-auto">
                                    <Table className="w-full border-collapse">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Plan
                                                </TableHead>
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Estado
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                            {suscripciones.length > 0 ? (
                                                suscripciones.map((sub) => (
                                                    <TableRow
                                                        key={sub.id}
                                                        className="hover:bg-gray-50/70"
                                                    >
                                                        <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            {sub.plan?.nombre ??
                                                                "Plan Gimnasio"}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                            <Badge
                                                                variant={
                                                                    sub.estado ===
                                                                    "activa"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className={
                                                                    sub.estado ===
                                                                    "activa"
                                                                        ? "capitalize bg-emerald-600 hover:bg-emerald-600 text-white"
                                                                        : "capitalize bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                                }
                                                            >
                                                                {sub.estado}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={2}
                                                        className="px-6 py-8 text-center text-sm text-gray-500"
                                                    >
                                                        Sin suscripciones
                                                        registradas.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
