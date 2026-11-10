import { Head, Link } from "@inertiajs/react";
import {
    User,
    Calendar,
    CreditCard,
    Dumbbell,
    DollarSign,
    CheckCircle2,
    XCircle,
    Clock,
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
}: ClientDashboardProps) {
    return (
        <>
            <Head title="Mi Panel - Gimnasio" />

            <div className="flex-1 space-y-6 p-8 pt-6">
                {/* Encabezado de Bienvenida */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            ¡Hola, {usuario.name}! 💪
                        </h2>
                        <p className="text-muted-foreground">
                            Aquí puedes ver el estado de tu membresía, tus
                            asistencias y tus pagos.
                        </p>
                    </div>
                </div>

                {/* Tarjetas de Métricas del Cliente */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Estado del Plan */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Mi Plan Actual
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {plan ? plan.plan.nombre : "Sin Plan Activo"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {plan ? (
                                    <span className="text-emerald-500 font-semibold flex items-center gap-1 mt-1">
                                        <CheckCircle2 className="h-3 w-3" />{" "}
                                        Activo (Vence: {plan.fecha_fin ?? "N/A"}
                                        )
                                    </span>
                                ) : (
                                    <span className="text-rose-500 font-semibold flex items-center gap-1 mt-1">
                                        <XCircle className="h-3 w-3" /> Requiere
                                        renovación
                                    </span>
                                )}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Asistencias este mes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Asistencias (Últimos 30 días)
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {ingresosMes}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total histórico: {ingresosTotales} ingresos
                            </p>
                        </CardContent>
                    </Card>

                    {/* Entrenador Asignado */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Mi Entrenador
                            </CardTitle>
                            <Dumbbell className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {entrenador ? entrenador.nombre : "Sin asignar"}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {entrenador
                                    ? entrenador.especialidad
                                    : "Entrenamiento General"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Inversión Total */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inversión Histórica
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalGasto}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Acumulado en pagos realizados
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sección de Tablas: Historial de Pagos y Suscripciones */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Historial de Pagos */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Mis Pagos Recientes</CardTitle>
                            <CardDescription>
                                Comprobantes y transacciones registradas en tu
                                cuenta
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Método</TableHead>
                                        <TableHead className="text-right">
                                            Monto
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pagosCliente.length > 0 ? (
                                        pagosCliente.map((pago) => (
                                            <TableRow key={pago.id}>
                                                <TableCell className="font-medium">
                                                    {new Date(
                                                        pago.fecha_pago,
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {pago.metodo_pago ??
                                                            "Efectivo / Transferencia"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-emerald-600">
                                                    ${pago.monto}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                No tienes pagos registrados
                                                todavía.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Historial de Suscripciones */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Mis Membresías</CardTitle>
                            <CardDescription>
                                Historial de planes contratados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Plan</TableHead>
                                        <TableHead className="text-right">
                                            Estado
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suscripciones.length > 0 ? (
                                        suscripciones.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell className="font-medium">
                                                    {sub.plan?.nombre ??
                                                        "Plan Gimnasio"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant={
                                                            sub.estado ===
                                                            "activa"
                                                                ? "default"
                                                                : "secondary"
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
                                                className="text-center text-muted-foreground py-6"
                                            >
                                                Sin suscripciones registradas.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
