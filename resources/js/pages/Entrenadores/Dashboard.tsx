import { Head, Link } from "@inertiajs/react";
import {
    Users,
    UserCheck,
    UserPlus,
    Dumbbell,
    ArrowUpRight,
    Calendar,
    Mail,
    Phone,
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
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

interface Plan {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    plan?: Plan;
}

interface UserData {
    id: number;
    name: string;
    apellido?: string;
    email: string;
    dni?: string;
    telefono?: string;
}

interface Alumno {
    id: number;
    user: UserData;
    subscriptions: Subscription[];
}

interface Entrenador {
    id: number;
    especialidad: string;
    limite_alumnos: number;
}

interface TrainerDashboardProps {
    usuario: UserData;
    entrenador: Entrenador;
    alumnos: Alumno[];
    totalAlumnos: number;
    cuposDisponibles: number;
    asistencias: number;
}

const PIE_COLORS = ["#4f46e5", "#e5e7eb"];

export default function TrainerDashboard({
    usuario,
    entrenador,
    alumnos = [],
    totalAlumnos = 0,
    cuposDisponibles = 0,
    asistencias = 0,
}: TrainerDashboardProps) {
    const porcentajeOcupacion =
        entrenador?.limite_alumnos > 0
            ? Math.min(
                  100,
                  Math.round((totalAlumnos / entrenador.limite_alumnos) * 100),
              )
            : 0;

    // Datos para el gráfico de torta (Ocupación de Cupos)
    const pieChartData = [
        { name: "Cupos Ocupados", value: totalAlumnos },
        { name: "Cupos Disponibles", value: cuposDisponibles },
    ];

    const formatearFecha = (fecha?: string) => {
        if (!fecha) return "—";
        return new Date(fecha + "T00:00:00").toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Panel de Entrenador - Gimnasio" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto space-y-6">
                    {/* Encabezado de Bienvenida */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                ¡Hola, {usuario?.name} {usuario?.apellido ?? ""}
                                !
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Panel del entrenador — Especialidad:{" "}
                                <span className="font-medium text-gray-700">
                                    {entrenador?.especialidad}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Tarjetas de Métricas Principales */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Alumnos Asignados
                                </CardTitle>
                                <Users className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {totalAlumnos} /{" "}
                                    {entrenador?.limite_alumnos ?? 0}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    <span className="font-semibold text-indigo-600">
                                        {porcentajeOcupacion}%
                                    </span>{" "}
                                    de capacidad ocupada
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Cupos Disponibles
                                </CardTitle>
                                <UserPlus className="h-4 w-4 text-emerald-600" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {cuposDisponibles}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {cuposDisponibles > 0
                                        ? "Lugares libres para asignar"
                                        : "Límite de alumnos alcanzado"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Asistencias de Hoy
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="text-2xl font-bold text-gray-900">
                                    {asistencias}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {totalAlumnos > 0
                                        ? `${asistencias} de ${totalAlumnos} alumnos vinieron hoy`
                                        : "Sin alumnos asignados aún"}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
                                <CardTitle className="text-sm font-medium text-gray-700">
                                    Especialidad
                                </CardTitle>
                                <Dumbbell className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="truncate text-2xl font-bold text-gray-900">
                                    {entrenador?.especialidad}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Cupo máximo:{" "}
                                    {entrenador?.limite_alumnos ?? 0} alumnos
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sección intermedia: Gráfico de Cupos + Datos del Perfil */}
                    <div className="grid gap-4 lg:grid-cols-7">
                        {/* Gráfico de Torta: Ocupación de Cupos */}
                        <Card className="lg:col-span-3 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Ocupación de Cupos
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Relación entre alumnos asignados y lugares
                                    libres
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="bg-white">
                                <div className="h-64 w-full">
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
                                                    boxShadow:
                                                        "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
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

                        {/* Ficha del Entrenador */}
                        <Card className="lg:col-span-4 shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white">
                                <CardTitle className="text-gray-900">
                                    Información del Perfil
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Datos personales y capacidad asignada en el
                                    sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 bg-white">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3.5">
                                        <p className="text-xs font-medium text-gray-500">
                                            Nombre Completo
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {usuario?.name}{" "}
                                            {usuario?.apellido ?? ""}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3.5">
                                        <p className="text-xs font-medium text-gray-500">
                                            Especialidad
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {entrenador?.especialidad}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3.5">
                                        <p className="text-xs font-medium text-gray-500">
                                            Correo Electrónico
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {usuario?.email}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-3.5">
                                        <p className="text-xs font-medium text-gray-500">
                                            Capacidad Máxima
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {entrenador?.limite_alumnos} alumnos
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla de Alumnos Asignados */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
                            <div>
                                <CardTitle className="text-gray-900">
                                    Mis Alumnos Asignados
                                </CardTitle>
                                <CardDescription className="text-gray-500">
                                    Listado completo de alumnos a tu cargo y el
                                    estado de su suscripción actual
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                            >
                                <Link
                                    href="/clientes"
                                    className="inline-flex items-center justify-center gap-1"
                                >
                                    Ir a clientes{" "}
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 bg-white">
                            <div className="overflow-x-auto">
                                <Table className="w-full border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                            <TableHead className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Alumno
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Contacto
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Plan Actual
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Vencimiento
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                                                Suscripción
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {alumnos.length > 0 ? (
                                            alumnos.map((alumno) => {
                                                const suscripcionActiva =
                                                    alumno.subscriptions?.[0];

                                                return (
                                                    <TableRow
                                                        key={alumno.id}
                                                        className="hover:bg-gray-50/70"
                                                    >
                                                        <TableCell className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                                            <div>
                                                                {
                                                                    alumno.user
                                                                        .name
                                                                }{" "}
                                                                {alumno.user
                                                                    .apellido ??
                                                                    ""}
                                                            </div>
                                                            {alumno.user
                                                                .dni && (
                                                                <span className="text-xs font-normal text-gray-500">
                                                                    DNI:{" "}
                                                                    {
                                                                        alumno
                                                                            .user
                                                                            .dni
                                                                    }
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                                <Mail className="h-3.5 w-3.5 text-gray-400" />
                                                                {
                                                                    alumno.user
                                                                        .email
                                                                }
                                                            </div>
                                                            {alumno.user
                                                                .telefono && (
                                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                                                                    <Phone className="h-3.5 w-3.5 text-gray-400" />
                                                                    {
                                                                        alumno
                                                                            .user
                                                                            .telefono
                                                                    }
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            {suscripcionActiva
                                                                ?.plan
                                                                ?.nombre ?? (
                                                                <span className="text-xs italic font-normal text-gray-500">
                                                                    Sin plan
                                                                    activo
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                            {suscripcionActiva ? (
                                                                <div className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                                                                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                                    {formatearFecha(
                                                                        suscripcionActiva.fecha_fin,
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">
                                                                    —
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                            {suscripcionActiva ? (
                                                                <Badge className="capitalize bg-emerald-600 hover:bg-emerald-600 text-white">
                                                                    Activa
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="capitalize bg-gray-100 text-gray-700 hover:bg-gray-100"
                                                                >
                                                                    Inactiva
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={5}
                                                    className="px-6 py-8 text-center text-sm text-gray-500"
                                                >
                                                    Todavía no tenés alumnos
                                                    asignados.
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
        </>
    );
}
