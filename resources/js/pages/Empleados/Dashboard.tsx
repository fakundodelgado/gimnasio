import { Head, Link } from "@inertiajs/react";
import {
    CreditCard,
    DollarSign,
    QrCode,
    AlertTriangle,
    Receipt,
    ArrowUpRight,
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

            <div className="flex-1 space-y-6 p-8 pt-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            ¡Hola, {usuario.name}!
                        </h2>
                        <p className="text-muted-foreground">
                            Panel operativo de recepción: control de actividad,
                            vencimientos próximos y últimos cobros.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/ingresos">Registrar Acceso</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/pagos/create">Nuevo Pago</Link>
                        </Button>
                    </div>
                </div>

                {/* Tarjetas de Métricas Principales */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Accesos Validados (30d)
                            </CardTitle>
                            <QrCode className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ingresosMes}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-emerald-500 font-semibold">
                                    {ingresosPermitidos}
                                </span>{" "}
                                totales históricos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cobros Procesados (30d)
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pagosMes}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-emerald-500 font-semibold">
                                    {pagosRegistrados}
                                </span>{" "}
                                pagos en total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Altas de Planes (30d)
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {suscripcionesMes}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-purple-500 font-semibold">
                                    {suscripcionesTotales}
                                </span>{" "}
                                suscripciones generadas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Vencimientos Próximos
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {suscripcionesVencer.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Planes activos que vencen esta semana
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráfico de Rendimiento + Tabla de Vencimientos Próximos */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Gráfico de Barras */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Mi Rendimiento Operativo</CardTitle>
                            <CardDescription>
                                Actividad de los últimos 30 días frente a tu
                                acumulado histórico
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
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
                                            dataKey="Último Mes"
                                            fill="#10b981"
                                            radius={[4, 4, 0, 0]}
                                            name="Últimos 30 días"
                                        />
                                        <Bar
                                            dataKey="Historico"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                            name="Histórico Total"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla de Suscripciones por Vencer */}
                    <Card className="col-span-3">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Próximos Vencimientos</CardTitle>
                                <CardDescription>
                                    Clientes a avisar en recepción
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href="/suscripciones"
                                    className="flex items-center gap-1"
                                >
                                    Ver todas{" "}
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {suscripcionesVencer.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-8 text-center">
                                    No hay suscripciones por vencer en los
                                    próximos días.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Plan</TableHead>
                                            <TableHead className="text-right">
                                                Vence
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {suscripcionesVencer.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell className="font-medium">
                                                    {sub.client?.user?.name ??
                                                        "Cliente sin nombre"}
                                                </TableCell>
                                                <TableCell>
                                                    {sub.plan?.nombre ?? "-"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-amber-500 border-amber-500/50"
                                                    >
                                                        {formatearFecha(
                                                            sub.fecha_fin,
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla Inferior: Últimos 5 Pagos Registrados por este Empleado */}
                <div className="grid gap-4 md:grid-cols-1">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Receipt className="h-5 w-5 text-emerald-500" />
                                <div>
                                    <CardTitle>
                                        Tus Últimos Cobros Registrados
                                    </CardTitle>
                                    <CardDescription>
                                        Historial reciente de los últimos 5
                                        pagos procesados bajo tu usuario
                                    </CardDescription>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href="/pagos"
                                    className="flex items-center gap-1"
                                >
                                    Historial completo{" "}
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {ultimosPagos.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-6 text-center">
                                    Aún no has registrado ningún pago.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>ID Pago</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Fecha de Pago</TableHead>
                                            <TableHead>Método</TableHead>
                                            <TableHead className="text-right">
                                                Monto
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ultimosPagos.map((pago) => (
                                            <TableRow key={pago.id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    #{pago.id}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {pago.subscription?.client
                                                        ?.user?.name ??
                                                        "Cliente no disponible"}
                                                </TableCell>
                                                <TableCell>
                                                    {formatearFecha(
                                                        pago.fecha_pago,
                                                    )}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {pago.metodo_pago ??
                                                        "Efectivo"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary">
                                                        ${pago.monto}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
