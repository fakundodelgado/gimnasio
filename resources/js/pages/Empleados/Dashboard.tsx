import { Head, Link } from "@inertiajs/react";
import {
    CreditCard,
    DollarSign,
    QrCode,
    AlertTriangle,
    Receipt,
    ArrowUpRight,
    Plus,
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

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface User {
    id: number;
    name: string;
    email: string;
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
    fecha_fin: string;
    estado: string;
    client?: Client;
    plan?: Plan;
}

interface Payment {
    id: number;
    monto: number;
    fecha_pago: string;
    metodo_pago?: string;
    subscription?: Subscription;
}

interface EmployeeDashboardProps {
    usuario: User;
    ingresosPermitidos: number;
    ingresosMes: number;
    pagosRegistrados: number;
    pagosMes: number;
    suscripcionesTotales: number;
    suscripcionesMes: number;
    ultimosPagos: Payment[];
    suscripcionesVencer: Subscription[];
}

export default function EmployeeDashboard({
    usuario,
    ingresosPermitidos = 0,
    ingresosMes = 0,
    pagosRegistrados = 0,
    pagosMes = 0,
    suscripcionesTotales = 0,
    suscripcionesMes = 0,
    ultimosPagos = [],
    suscripcionesVencer = [],
}: EmployeeDashboardProps) {
    // Datos para el gráfico comparativo
    const performanceData = [
        {
            name: "Ingresos / Accesos",
            Historico: ingresosPermitidos,
            "Último Mes": ingresosMes,
        },
        {
            name: "Pagos Registrados",
            Historico: pagosRegistrados,
            "Último Mes": pagosMes,
        },
        {
            name: "Altas de Suscripción",
            Historico: suscripcionesTotales,
            "Último Mes": suscripcionesMes,
        },
    ];

    // Función auxiliar para formatear fechas YYYY-MM-DD a DD/MM/YYYY
    const formatearFecha = (fechaStr: string) => {
        if (!fechaStr) return "-";
        const soloFecha = fechaStr.split("T")[0].split(" ")[0];
        const partes = soloFecha.split("-");
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return fechaStr;
    };

    return (
        <>
            <Head title="Panel de Empleado - Gimnasio" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                ¡Hola, {usuario.name}!
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Panel operativo de recepción: control de
                                actividad, vencimientos próximos y últimos
                                cobros.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                            <Button
                                asChild
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/ingresos/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Registrar Acceso
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/pagos/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Pago
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Tarjetas de Métricas Principales */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Accesos Validados (Últimos 30 días)
                                </CardTitle>
                                <QrCode className="h-4 w-4 text-indigo-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {ingresosMes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-emerald-600 font-semibold">
                                        {ingresosPermitidos}
                                    </span>{" "}
                                    totales históricos
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Cobros Procesados (Últimos 30 días)
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {pagosMes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-emerald-600 font-semibold">
                                        {pagosRegistrados}
                                    </span>{" "}
                                    pagos en total
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Altas de Planes (Últimos 30 días)
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-indigo-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {suscripcionesMes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-indigo-600 font-semibold">
                                        {suscripcionesTotales}
                                    </span>{" "}
                                    suscripciones generadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Vencimientos Próximos
                                </CardTitle>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {suscripcionesVencer.length}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Planes activos que vencen esta semana
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráfico de Rendimiento + Tabla de Vencimientos Próximos */}
                    <div className="grid gap-4 lg:grid-cols-7">
                        {/* Gráfico de Barras */}
                        <Card className="lg:col-span-4 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Mi Rendimiento Operativo
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Actividad de los últimos 30 días frente a tu
                                    acumulado histórico
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="h-72 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={performanceData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 0,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e5e7eb"
                                            />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#6b7280"
                                                fontSize={12}
                                            />
                                            <YAxis
                                                stroke="#6b7280"
                                                fontSize={12}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    borderColor: "#e5e7eb",
                                                    borderRadius: "8px",
                                                    color: "#111827",
                                                }}
                                                labelStyle={{
                                                    color: "#111827",
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <Bar
                                                dataKey="Último Mes"
                                                fill="#10b981"
                                                radius={[4, 4, 0, 0]}
                                                name="Últimos 30 días"
                                            />
                                            <Bar
                                                dataKey="Historico"
                                                fill="#4f46e5"
                                                radius={[4, 4, 0, 0]}
                                                name="Histórico Total"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabla de Suscripciones por Vencer */}
                        <Card className="lg:col-span-3 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-white">
                                <div>
                                    <CardTitle className="text-gray-900">
                                        Próximos Vencimientos
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Clientes a avisar en recepción
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="bg-white w-full sm:w-auto"
                                >
                                    <Link
                                        href="/suscripciones"
                                        className="inline-flex items-center justify-center gap-1"
                                    >
                                        Ver todas
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0 bg-white">
                                {suscripcionesVencer.length === 0 ? (
                                    <p className="text-sm text-gray-500 py-8 px-6 text-center">
                                        No hay suscripciones por vencer en los
                                        próximos días.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table className="w-full border-collapse">
                                            <TableHeader>
                                                <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                                    <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                        Cliente
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                        Plan
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                        Vence
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                                {suscripcionesVencer.map(
                                                    (sub) => (
                                                        <TableRow
                                                            key={sub.id}
                                                            className="hover:bg-gray-50/70"
                                                        >
                                                            <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                                {sub.client
                                                                    ?.user
                                                                    ?.name ??
                                                                    "Cliente sin nombre"}
                                                            </TableCell>
                                                            <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                                {sub.plan
                                                                    ?.nombre ??
                                                                    "—"}
                                                            </TableCell>
                                                            <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-amber-50 text-amber-700 border-amber-300"
                                                                >
                                                                    {formatearFecha(
                                                                        sub.fecha_fin,
                                                                    )}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla Inferior: Últimos 5 Pagos Registrados por este Empleado */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
                            <div className="flex items-center gap-2.5">
                                <Receipt className="h-5 w-5 text-emerald-600 shrink-0" />
                                <div>
                                    <CardTitle className="text-gray-900">
                                        Tus Últimos Cobros Registrados
                                    </CardTitle>
                                    <CardDescription className="text-gray-500">
                                        Historial reciente de los últimos 5
                                        pagos procesados bajo tu usuario
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="bg-white w-full sm:w-auto"
                            >
                                <Link
                                    href="/pagos"
                                    className="inline-flex items-center justify-center gap-1"
                                >
                                    Historial completo
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 bg-white">
                            {ultimosPagos.length === 0 ? (
                                <p className="text-sm text-gray-500 py-8 px-6 text-center">
                                    Aún no registraste ningún pago.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table className="w-full border-collapse">
                                        <TableHeader>
                                            <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    ID Pago
                                                </TableHead>
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Cliente
                                                </TableHead>
                                                <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                    Fecha de Pago
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
                                            {ultimosPagos.map((pago) => (
                                                <TableRow
                                                    key={pago.id}
                                                    className="hover:bg-gray-50/70"
                                                >
                                                    <TableCell className="px-6 py-4 text-center font-mono text-xs text-gray-500 whitespace-nowrap">
                                                        #{pago.id}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                        {pago.subscription
                                                            ?.client?.user
                                                            ?.name ??
                                                            "Cliente no disponible"}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        {formatearFecha(
                                                            pago.fecha_pago,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center capitalize whitespace-nowrap">
                                                        {pago.metodo_pago ??
                                                            "Efectivo"}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-gray-100 text-gray-900 hover:bg-gray-100 font-semibold"
                                                        >
                                                            $
                                                            {Number(
                                                                pago.monto,
                                                            ).toLocaleString(
                                                                "es-AR",
                                                            )}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
