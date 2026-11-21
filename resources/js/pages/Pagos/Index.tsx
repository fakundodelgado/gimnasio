import React, { useState, FormEvent } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Plus,
    ChevronDown,
    Search,
    RotateCcw,
    Eye,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    FileDown,
    FileSpreadsheet,
} from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/confirmar-eliminacion";
import { ConfirmarRestauracion } from "@/components/confirmar-restauracion";
import { useAuth } from "@/hooks/use-auth";

interface User {
    id: number;
    name: string;
    email: string;
    deleted_at?: string | null;
}

interface Client {
    id: number;
    user_id: number;
    telefono?: string;
    deleted_at?: string | null;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    client?: Client;
    plan?: Plan;
}

interface Employee {
    id: number;
    user_id: number;
    cuil?: string;
    deleted_at?: string | null;
    user?: User;
}

interface Payment {
    id: number;
    subscription_id: number;
    employee_id?: number;
    monto: number;
    fecha_pago: string;
    metodo_pago: string;
    deleted_at: string | null;
    subscription?: Subscription;
    employee?: Employee;
}

interface PagosPaginados {
    data: Payment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Filtros {
    datos: string;
    empleado: string;
    id: string;
    suscripcion: string;
    metodo: string;
    desde: string;
    hasta: string;
    orden: string;
    papelera: string;
    direccion: string;
    paginas: number;
}

interface IndexProps {
    pagos: PagosPaginados;
    filtros: Filtros;
    esAdmin: boolean;
    esCliente: boolean;
}

export default function Index({
    pagos,
    filtros,
    esAdmin,
    esCliente,
}: IndexProps) {
    const [datos, setDatos] = useState(filtros.datos ?? "");
    const [empleado, setEmpleado] = useState(filtros.empleado ?? "");
    const [id, setId] = useState(filtros.id ?? "");
    const [suscripcion, setSuscripcion] = useState(filtros.suscripcion ?? "");
    const [metodo, setMetodo] = useState(filtros.metodo ?? "");
    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "fecha_pago");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );
    const { can } = useAuth();

    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/pagos",
            {
                datos,
                empleado,
                id,
                suscripcion,
                metodo,
                desde,
                hasta,
                orden,
                direccion,
                paginas,
                papelera,
                ...overrides,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        enviarConsulta();
    };

    const limpiarFiltros = () => {
        setDatos("");
        setEmpleado("");
        setId("");
        setSuscripcion("");
        setMetodo("");
        setDesde("");
        setHasta("");
        setOrden("fecha_pago");
        setDireccion("desc");
        setPaginas(5);
        setPapelera("sin_eliminados");

        router.get("/pagos");
    };

    const ordenarPor = (campo: string) => {
        let nuevaDireccion = "asc";
        if (orden === campo && direccion === "asc") {
            nuevaDireccion = "desc";
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);

        enviarConsulta({
            orden: campo,
            direccion: nuevaDireccion,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return null;
        return direccion === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 inline-block ml-1 text-indigo-600" />
        ) : (
            <ArrowDown className="w-3.5 h-3.5 inline-block ml-1 text-indigo-600" />
        );
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const pagoSeleccionado = pagos.data.find(
        (pago) => pago.id === idSeleccionado,
    );

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/pagos/${idSeleccionado}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [idARestaurar, setIdARestaurar] = useState<number | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    const pagoARestaurar = pagos.data.find((pago) => pago.id === idARestaurar);

    const handleRestore = (id: number) => {
        setIdARestaurar(id);
        setIsRestoreModalOpen(true);
    };

    const ejecutarRestauracion = () => {
        if (!idARestaurar) return;
        setIsRestoring(true);
        router.patch(
            `/pagos/${idARestaurar}/restore`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsRestoreModalOpen(false);
                    setIdARestaurar(null);
                },
                onFinish: () => setIsRestoring(false),
            },
        );
    };

    // Query string exacta para que los reportes en PDF y Excel apliquen los mismos filtros
    const queryExportacion = new URLSearchParams({
        datos,
        empleado,
        id,
        suscripcion,
        metodo,
        desde,
        hasta,
        orden,
        direccion,
        papelera,
    }).toString();

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const totalColumnas = esAdmin ? 10 : esCliente ? 7 : 9;

    return (
        <>
            <Head title="Historial de Pagos y Caja" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Historial de Pagos y Caja
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Consultá los comprobantes registrados, métodos
                                de cobro, fechas y movimientos de caja.
                            </p>
                        </div>

                        {can("crear pago") && (
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/pagos/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Registrar Nuevo Pago
                                </Link>
                            </Button>
                        )}
                    </div>

                    {/* Filtros */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white mb-6">
                        <CardContent className="p-4 sm:p-5 bg-white">
                            <form
                                onSubmit={aplicarFiltros}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {!esCliente && (
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Cliente
                                            </label>
                                            <input
                                                type="text"
                                                value={datos}
                                                onChange={(e) =>
                                                    setDatos(e.target.value)
                                                }
                                                placeholder="Nombre, email o teléfono..."
                                                className={inputBaseClass}
                                            />
                                        </div>
                                    )}

                                    {esAdmin && (
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Empleado
                                            </label>
                                            <input
                                                type="text"
                                                value={empleado}
                                                onChange={(e) =>
                                                    setEmpleado(e.target.value)
                                                }
                                                placeholder="Nombre o CUIL..."
                                                className={inputBaseClass}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            N° Pago (ID)
                                        </label>
                                        <input
                                            type="text"
                                            value={id}
                                            onChange={(e) =>
                                                setId(e.target.value)
                                            }
                                            placeholder="Ej. 54"
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            N° Suscripción
                                        </label>
                                        <input
                                            type="text"
                                            value={suscripcion}
                                            onChange={(e) =>
                                                setSuscripcion(e.target.value)
                                            }
                                            placeholder="Ej. 102"
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Método de Pago
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={metodo}
                                                onChange={(e) =>
                                                    setMetodo(e.target.value)
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value="">
                                                    Todos los métodos
                                                </option>
                                                <option value="efectivo">
                                                    Efectivo
                                                </option>
                                                <option value="transferencia">
                                                    Transferencia
                                                </option>
                                                <option value="tarjeta">
                                                    Tarjeta
                                                </option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={desde}
                                            onChange={(e) =>
                                                setDesde(e.target.value)
                                            }
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={hasta}
                                            onChange={(e) =>
                                                setHasta(e.target.value)
                                            }
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mostrar
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={paginas}
                                                onChange={(e) =>
                                                    setPaginas(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value={5}>
                                                    5 por página
                                                </option>
                                                <option value={10}>
                                                    10 por página
                                                </option>
                                                <option value={20}>
                                                    20 por página
                                                </option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    {esAdmin && (
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Papelera
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={papelera}
                                                    onChange={(e) =>
                                                        setPapelera(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className={selectBaseClass}
                                                >
                                                    <option value="sin_eliminados">
                                                        No eliminados
                                                    </option>
                                                    <option value="solo_eliminados">
                                                        Solo eliminados
                                                        (Papelera)
                                                    </option>
                                                    <option value="con_eliminados">
                                                        Todos (Incl. eliminados)
                                                    </option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
                                    {esAdmin ? (
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Reportes:
                                            </span>
                                            <div className="flex flex-col sm:flex-row gap-2.5">
                                                <a
                                                    href={`/pagos/pdf?${queryExportacion}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    title="Generar reporte de pagos en PDF"
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition"
                                                >
                                                    <FileDown className="w-4 h-4" />
                                                    Reporte PDF
                                                </a>

                                                <a
                                                    href={`/pagos/export?${queryExportacion}`}
                                                    title="Generar reporte de pagos en Excel"
                                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition"
                                                >
                                                    <FileSpreadsheet className="w-4 h-4" />
                                                    Reporte Excel
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div />
                                    )}

                                    <div className="flex flex-col sm:flex-row justify-end gap-2.5">
                                        <Button
                                            type="submit"
                                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            <Search className="w-4 h-4 mr-2" />
                                            Buscar
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={limpiarFiltros}
                                            className="w-full sm:w-auto bg-white"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Limpiar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tabla de Pagos */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardContent className="p-0 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                            <th
                                                onClick={() => ordenarPor("id")}
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Comprobante #
                                                    {indicadorOrden("id")}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Cliente
                                            </th>
                                            {!esCliente && (
                                                <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                    Teléfono
                                                </th>
                                            )}
                                            {!esCliente && (
                                                <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                    Email
                                                </th>
                                            )}
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Plan
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("monto")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Monto
                                                    {indicadorOrden("monto")}
                                                </span>
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("metodo_pago")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Método
                                                    {indicadorOrden(
                                                        "metodo_pago",
                                                    )}
                                                </span>
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("fecha_pago")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Fecha
                                                    {indicadorOrden(
                                                        "fecha_pago",
                                                    )}
                                                </span>
                                            </th>
                                            {esAdmin && (
                                                <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                    Cobrado Por
                                                </th>
                                            )}
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {pagos.data.length > 0 ? (
                                            pagos.data.map((pago: Payment) => (
                                                <tr
                                                    key={pago.id}
                                                    className={
                                                        pago.deleted_at
                                                            ? "bg-red-50/60 hover:bg-red-50"
                                                            : "hover:bg-gray-50/70"
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="font-medium text-gray-900">
                                                                #{pago.id} (Sub
                                                                #
                                                                {
                                                                    pago.subscription_id
                                                                }
                                                                )
                                                            </span>
                                                            {pago.deleted_at && (
                                                                <span className="text-xs font-semibold text-red-600">
                                                                    (ANULADO /
                                                                    ELIMINADO)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="font-medium text-gray-900">
                                                                {pago
                                                                    .subscription
                                                                    ?.client
                                                                    ?.user
                                                                    ?.name ??
                                                                    "Cliente N/A"}
                                                            </span>
                                                            {pago.subscription
                                                                ?.client
                                                                ?.deleted_at && (
                                                                <span className="text-xs text-gray-500">
                                                                    (Cliente
                                                                    Eliminado)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {!esCliente && (
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {pago.subscription
                                                                ?.client
                                                                ?.telefono ||
                                                                "—"}
                                                        </td>
                                                    )}
                                                    {!esCliente && (
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {pago.subscription
                                                                ?.client?.user
                                                                ?.email || "—"}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {pago.subscription?.plan
                                                            ?.nombre ??
                                                            "Plan N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                        $
                                                        {Number(
                                                            pago.monto,
                                                        ).toLocaleString(
                                                            "es-AR",
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center capitalize whitespace-nowrap">
                                                        {pago.metodo_pago}
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {pago.fecha_pago}
                                                    </td>
                                                    {esAdmin && (
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-medium text-gray-900">
                                                                    {pago
                                                                        .employee
                                                                        ?.user
                                                                        ?.name ??
                                                                        "Sistema / Admin"}
                                                                </span>
                                                                {pago.employee
                                                                    ?.cuil && (
                                                                    <span className="text-xs text-gray-500">
                                                                        CUIL:{" "}
                                                                        {
                                                                            pago
                                                                                .employee
                                                                                .cuil
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {pago.deleted_at ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRestore(
                                                                        pago.id,
                                                                    )
                                                                }
                                                                className="inline-flex items-center whitespace-nowrap font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                                                            >
                                                                <RotateCcw className="w-4 h-4 mr-1.5" />
                                                                Restaurar
                                                            </button>
                                                        ) : (
                                                            <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap">
                                                                {can(
                                                                    "mostrar pago",
                                                                ) && (
                                                                    <Link
                                                                        href={`/pagos/${pago.id}`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-gray-700 hover:text-indigo-600"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1.5" />
                                                                        Ver
                                                                    </Link>
                                                                )}
                                                                {can(
                                                                    "editar pago",
                                                                ) && (
                                                                    <Link
                                                                        href={`/pagos/${pago.id}/edit`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-indigo-600 hover:text-indigo-800"
                                                                    >
                                                                        <Pencil className="w-4 h-4 mr-1.5" />
                                                                        Editar
                                                                    </Link>
                                                                )}
                                                                {can(
                                                                    "eliminar pago",
                                                                ) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                pago.id,
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-red-600 hover:text-red-800 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-1.5" />
                                                                        Eliminar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={totalColumnas}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay registros de pagos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Mostrando{" "}
                                <span className="font-semibold text-gray-900">
                                    {pagos.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {pagos.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {pagos.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {pagos.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                pagos.prev_page_url!,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        Anterior
                                    </Button>
                                )}

                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    Página{" "}
                                    <span className="font-semibold text-gray-900">
                                        {pagos.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {pagos.last_page}
                                    </span>
                                </span>

                                {pagos.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                pagos.next_page_url!,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <ConfirmarRestauracion
                open={isRestoreModalOpen}
                onOpenChange={setIsRestoreModalOpen}
                onConfirm={ejecutarRestauracion}
                isRestoring={isRestoring}
                title="¿Restaurar pago?"
                itemLabel={
                    pagoARestaurar ? `Pago #${pagoARestaurar.id}` : undefined
                }
                description="El pago volverá a estar activo en el sistema."
                confirmText="Sí, restaurar pago"
            />

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Eliminar pago?"
                itemLabel={
                    pagoSeleccionado
                        ? `Pago #${pagoSeleccionado.id}`
                        : undefined
                }
                description="Esta acción no se puede deshacer."
                confirmText="Sí, eliminar pago"
            />
        </>
    );
}
