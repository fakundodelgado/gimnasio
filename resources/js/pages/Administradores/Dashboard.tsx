import { Head, Link } from "@inertiajs/react";
import {
    Users,
    CreditCard,
    Dumbbell,
    ArrowUpRight,
    DollarSign,
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

// Componentes de Recharts
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface Plan {
    id: number;
    nombre: string;
    precio: number;
    subscriptions_count?: number;
}

interface DashboardProps {
    clientes: number;
    clientesActivos: number;
    clientesInactivos: number;
    usuarios: number;
    empleados: number;
    entrenadores: number;
    planes: Plan[];
    suscripciones: number;
    suscripcionesActivas: number;
    suscripcionesPendientes: number;
    pagos: number;
    pagosMes: number;
    generadoMes: number;
}

const PIE_COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function AdminDashboard({
    clientes = 0,
    clientesActivos = 0,
    clientesInactivos = 0,
    usuarios = 0,
    empleados = 0,
    entrenadores = 0,
    planes = [],
    suscripciones = 0,
    suscripcionesActivas = 0,
    suscripcionesPendientes = 0,
    pagosMes = 0,
    generadoMes = 0,
}: DashboardProps) {
    // Mapeo para el gráfico de barras (Suscripciones por Plan)
    const barChartData = planes.map((p) => ({
        name: p.nombre,
        suscripciones: p.subscriptions_count ?? 0,
    }));

    // Mapeo para el gráfico de torta (Estado de Suscripciones)
    const pieChartData = [
        { name: "Activas", value: suscripcionesActivas },
        { name: "Pendientes", value: suscripcionesPendientes },
    ];

    return (
        <>
            <Head title="Panel de Administración - Gimnasio" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Panel de Control del Gimnasio
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Resumen general de clientes, planes,
                                suscripciones y finanzas.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Link href="/clientes/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Cliente
                            </Link>
                        </Button>
                    </div>

                    {/* Tarjetas de Métricas Principales */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Clientes Totales
                                </CardTitle>
                                <Users className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {clientes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="text-emerald-600 font-semibold">
                                        {clientesActivos}
                                    </span>{" "}
                                    activos /{" "}
                                    <span className="text-yellow-600 font-semibold">
                                        {suscripcionesPendientes}
                                    </span>{" "}
                                    pendientes /{" "}
                                    <span className="text-red-600 font-semibold">
                                        {clientesInactivos -
                                            suscripcionesPendientes}
                                    </span>{" "}
                                    inactivos
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Suscripciones Totales (Historico)
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {suscripciones}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {suscripcionesActivas} planes vigentes
                                    actualmente
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Pagos (Últimos 30 días)
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {pagosMes}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Ingresos generados: ${generadoMes}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Entrenadores Activos
                                </CardTitle>
                                <Dumbbell className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {entrenadores}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {empleados} empleados en total ({usuarios}{" "}
                                    usuarios)
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección de Gráficos (Barras + Torta) */}
                    <div className="grid gap-4 lg:grid-cols-7">
                        {/* Gráfico de Barras: Suscripciones por Plan */}
                        <Card className="lg:col-span-4 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Popularidad de Planes
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Cantidad de suscripciones asociadas a cada
                                    plan históricamente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="h-72 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={barChartData}
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
                                                dataKey="suscripciones"
                                                fill="#4f46e5"
                                                radius={[4, 4, 0, 0]}
                                                name="Suscripciones"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Gráfico de Torta: Estado de Suscripciones */}
                        <Card className="lg:col-span-3 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Estado de Suscripciones
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Proporción de activas vs inactivas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="h-72 w-full">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieChartData.map(
                                                    (_, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                PIE_COLORS[
                                                                    index %
                                                                        PIE_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#ffffff",
                                                    borderColor: "#e5e7eb",
                                                    borderRadius: "8px",
                                                    color: "#111827",
                                                }}
                                                itemStyle={{ color: "#111827" }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla de Planes */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white">
                            <div>
                                <CardTitle className="text-gray-900">
                                    Detalle de Planes del Gimnasio
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Listado de planes actuales y su nivel de
                                    adopción
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="bg-white w-full sm:w-auto"
                            >
                                <Link
                                    href="/planes"
                                    className="inline-flex items-center justify-center gap-1"
                                >
                                    Gestionar planes
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 bg-white">
                            <div className="overflow-x-auto">
                                <Table className="w-full border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Nombre del Plan
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Precio
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Suscripciones Vinculadas
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {planes.map((plan) => (
                                            <TableRow
                                                key={plan.id}
                                                className="hover:bg-gray-50/70"
                                            >
                                                <TableCell className="px-6 py-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                    {plan.nombre}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                    $
                                                    {Number(
                                                        plan.precio,
                                                    ).toLocaleString("es-AR")}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gray-100 text-gray-800 hover:bg-gray-100"
                                                    >
                                                        {plan.subscriptions_count ??
                                                            0}{" "}
                                                        usuarios
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
