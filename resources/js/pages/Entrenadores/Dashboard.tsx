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

const PIE_COLORS = ["#3b82f6", "#27272a"];

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

            <div className="flex-1 space-y-6 p-8 pt-6">
                {/* Encabezado */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Panel del Entrenador
                        </h2>
                        <p className="text-muted-foreground">
                            Bienvenido, {usuario?.name}{" "}
                            {usuario?.apellido ?? ""} — Especialidad:{" "}
                            {entrenador?.especialidad}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button asChild>
                            <Link href="/clientes">Ver Todos los Clientes</Link>
                        </Button>
                    </div>
                </div>

                {/* Tarjetas de Métricas Principal */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Alumnos Asignados
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalAlumnos} /{" "}
                                {entrenador?.limite_alumnos ?? 0}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="font-semibold text-blue-500">
                                    {porcentajeOcupacion}%
                                </span>{" "}
                                de capacidad ocupada
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cupos Disponibles
                            </CardTitle>
                            <UserPlus className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {cuposDisponibles}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {cuposDisponibles > 0
                                    ? "Lugares libres para asignar"
                                    : "Límite de alumnos alcanzado"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Asistencias de Hoy
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-violet-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {asistencias}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {totalAlumnos > 0
                                    ? `${asistencias} de ${totalAlumnos} alumnos vinieron hoy`
                                    : "Sin alumnos asignados aún"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Especialidad
                            </CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="truncate text-2xl font-bold">
                                {entrenador?.especialidad}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Cupo máximo: {entrenador?.limite_alumnos ?? 0}{" "}
                                alumnos
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección intermedia: Gráfico de Cupos + Datos del Perfil */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Gráfico de Torta: Ocupación de Cupos */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Ocupación de Cupos</CardTitle>
                            <CardDescription>
                                Relación entre alumnos asignados y lugares
                                libres
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full">
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

                    {/* Ficha del Entrenador */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Información del Perfil</CardTitle>
                            <CardDescription>
                                Datos personales y capacidad asignada en el
                                sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Nombre Completo
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {usuario?.name}{" "}
                                        {usuario?.apellido ?? ""}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Especialidad
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {entrenador?.especialidad}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Correo Electrónico
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {usuario?.email}
                                    </p>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Capacidad Máxima
                                    </p>
                                    <p className="mt-1 font-semibold">
                                        {entrenador?.limite_alumnos} alumnos
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla de Alumnos Asignados */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Mis Alumnos Asignados</CardTitle>
                                <CardDescription>
                                    Listado completo de alumnos a tu cargo y el
                                    estado de su suscripción actual
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href="/clientes"
                                    className="flex items-center gap-1"
                                >
                                    Ir a clientes{" "}
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {alumnos.length === 0 ? (
                                <div className="py-10 text-center text-sm text-muted-foreground">
                                    Todavía no tienes alumnos asignados.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Alumno</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Plan Actual</TableHead>
                                            <TableHead>Vencimiento</TableHead>
                                            <TableHead className="text-right">
                                                Suscripción
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {alumnos.map((alumno) => {
                                            const suscripcionActiva =
                                                alumno.subscriptions?.[0];

                                            return (
                                                <TableRow key={alumno.id}>
                                                    <TableCell className="font-semibold">
                                                        <div>
                                                            {alumno.user.name}{" "}
                                                            {alumno.user
                                                                .apellido ?? ""}
                                                        </div>
                                                        {alumno.user.dni && (
                                                            <span className="text-xs font-normal text-muted-foreground">
                                                                DNI:{" "}
                                                                {
                                                                    alumno.user
                                                                        .dni
                                                                }
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                            <Mail className="h-3.5 w-3.5" />
                                                            {alumno.user.email}
                                                        </div>
                                                        {alumno.user
                                                            .telefono && (
                                                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                <Phone className="h-3.5 w-3.5" />
                                                                {
                                                                    alumno.user
                                                                        .telefono
                                                                }
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {suscripcionActiva?.plan
                                                            ?.nombre ?? (
                                                            <span className="text-xs italic text-muted-foreground">
                                                                Sin plan activo
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {suscripcionActiva ? (
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                                {formatearFecha(
                                                                    suscripcionActiva.fecha_fin,
                                                                )}
                                                            </div>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {suscripcionActiva ? (
                                                            <Badge className="bg-emerald-600 hover:bg-emerald-700">
                                                                Activa
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                Inactiva
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
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
