import { Head, Link } from "@inertiajs/react";
import {
    Users,
    UserCheck,
    CreditCard,
    Dumbbell,
    ArrowUpRight,
    TrendingUp,
    DollarSign,
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
    suscripcionesInactivas: number;
    pagos: number;
    pagosMes: number;
}

// Paleta de colores adaptada a modo oscuro
const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];

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
    suscripcionesInactivas = 0,
    pagos = 0,
    pagosMes = 0,
}: DashboardProps) {
    // Mapeo para el gráfico de barras (Suscripciones por Plan)
    const barChartData = planes.map((p) => ({
        name: p.nombre,
        suscripciones: p.subscriptions_count ?? 0,
    }));

    // Mapeo para el gráfico de torta (Estado de Suscripciones)
    const pieChartData = [
        { name: "Activas", value: suscripcionesActivas },
        { name: "Inactivas", value: suscripcionesInactivas },
    ];

    return (
        <>
            <Head title="Panel de Administración - Gimnasio" />

            <div className="flex-1 space-y-6 p-8 pt-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Panel de Control del Gimnasio
                        </h2>
                        <p className="text-muted-foreground">
                            Resumen general de clientes, planes, suscripciones y
                            finanzas.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild>
                            <Link href="/clientes/create">Nuevo Cliente</Link>
                        </Button>
                    </div>
                </div>

                {/* Tarjetas de Métricas Principal */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Clientes Totales
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clientes}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-emerald-500 font-semibold">
                                    {clientesActivos}
                                </span>{" "}
                                activos /{" "}
                                <span className="text-rose-500 font-semibold">
                                    {clientesInactivos}
                                </span>{" "}
                                inactivos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Suscripciones
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {suscripciones}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {suscripcionesActivas} planes vigentes
                                actualmente
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pagos (Últimos 30 días)
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pagosMes}</div>
                            <p className="text-xs text-muted-foreground">
                                Total histórico: {pagos} registros
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Personal Activo
                            </CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {entrenadores}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {empleados} empleados en total ({usuarios}{" "}
                                usuarios)
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Gráficos (Barras + Torta) */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Gráfico de Barras: Suscripciones por Plan */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Popularidad de Planes</CardTitle>
                            <CardDescription>
                                Cantidad de suscripciones asociadas a cada plan
                                historicamente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                                            stroke="#27272a"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#a1a1aa"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            stroke="#a1a1aa"
                                            fontSize={12}
                                            allowDecimals={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                borderColor: "#27272a",
                                                borderRadius: "8px",
                                            }}
                                            labelStyle={{
                                                color: "#fafafa",
                                                fontWeight: 600,
                                            }}
                                        />
                                        <Bar
                                            dataKey="suscripciones"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            name="Suscripciones"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gráfico de Torta: Estado de Suscripciones */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Estado de Suscripciones</CardTitle>
                            <CardDescription>
                                Proporción de activas vs inactivos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                                            {pieChartData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[
                                                            index %
                                                                PIE_COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#18181b",
                                                borderColor: "#27272a",
                                                borderRadius: "8px",
                                            }}
                                            itemStyle={{ color: "#fafafa" }}
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

                {/* Tablas de Planes y Resumen */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>
                                    Detalle de Planes del Gimnasio
                                </CardTitle>
                                <CardDescription>
                                    Listado de planes actuales y su nivel de
                                    adopción
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href="/planes"
                                    className="flex items-center gap-1"
                                >
                                    Gestionar planes{" "}
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre del Plan</TableHead>
                                        <TableHead>Precio</TableHead>
                                        <TableHead className="text-right">
                                            Suscripciones Vinculadas
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {planes.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-semibold">
                                                {plan.nombre}
                                            </TableCell>
                                            <TableCell>
                                                ${plan.precio}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="secondary">
                                                    {plan.subscriptions_count ??
                                                        0}{" "}
                                                    usuarios
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
