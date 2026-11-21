import React, { useState, FormEvent } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";
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
} from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/confirmar-eliminacion";
import { ConfirmarRestauracion } from "@/components/confirmar-restauracion";

interface User {
    id: number;
    name: string;
    email?: string;
}

interface Client {
    id: number;
    telefono?: string;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    deleted_at: string | null;
    client?: Client;
    plan?: Plan;
}

interface SuscripcionesPaginadas {
    data: Subscription[];
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
    id: string;
    orden: string;
    papelera: string;
    direccion: string;
    paginas: number;
    desde: string;
    hasta: string;
    plan: string;
    estado: string;
}

interface IndexProps {
    suscripciones: SuscripcionesPaginadas;
    planes: Plan[];
    filtros: Filtros;
    esAdmin: boolean;
    esCliente: boolean;
}

export default function Index({
    suscripciones,
    planes,
    filtros,
    esAdmin,
    esCliente,
}: IndexProps) {
    const [datos, setDatos] = useState(filtros.datos ?? "");
    const [id, setId] = useState(filtros.id ?? "");
    const [plan, setPlan] = useState(filtros.plan ?? "");
    const [estado, setEstado] = useState(filtros.estado ?? "");
    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "fecha_inicio");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const opcionesPlanes = planes.map((p) => ({
        id: String(p.id),
        label: `#${p.id} - ${p.nombre}`,
    }));

    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/suscripciones",
            {
                datos,
                id,
                plan,
                estado,
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
        setId("");
        setPlan("");
        setEstado("");
        setDesde("");
        setHasta("");
        setOrden("fecha_inicio");
        setDireccion("desc");
        setPaginas(5);
        setPapelera("sin_eliminados");

        router.get("/suscripciones");
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

    const suscripcionSeleccionada = suscripciones.data.find(
        (suscripcion) => suscripcion.id === idSeleccionado,
    );

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/suscripciones/${idSeleccionado}`, {
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

    const suscripcionARestaurar = suscripciones.data.find(
        (suscripcion) => suscripcion.id === idARestaurar,
    );

    const handleRestore = (id: number) => {
        setIdARestaurar(id);
        setIsRestoreModalOpen(true);
    };

    const ejecutarRestauracion = () => {
        if (!idARestaurar) return;
        setIsRestoring(true);
        router.patch(
            `/suscripciones/${idARestaurar}/restore`,
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

    const getEstadoBadgeClass = (estadoValor: string) => {
        switch (estadoValor.toLowerCase()) {
            case "activa":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "pendiente":
                return "bg-amber-50 text-amber-800 border-amber-200";
            case "vencida":
                return "bg-gray-100 text-gray-700 border-gray-200";
            case "cancelada":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const totalColumnas = esCliente ? 8 : 10;

    return (
        <>
            <Head title="Listado de Suscripciones" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-8xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Listado de Suscripciones
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Consultá y administrá las suscripciones, planes
                                contratados, fechas de vigencia y estados.
                            </p>
                        </div>

                        {!esCliente && (
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/suscripciones/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Suscripción
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

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            N° Suscripción (ID)
                                        </label>
                                        <input
                                            type="text"
                                            value={id}
                                            onChange={(e) =>
                                                setId(e.target.value)
                                            }
                                            placeholder="Ej. 102"
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Plan
                                        </label>
                                        <SelectBuscador
                                            options={opcionesPlanes}
                                            value={plan}
                                            onChange={(val) =>
                                                setPlan(String(val))
                                            }
                                            placeholder="Todos los planes..."
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Estado
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={estado}
                                                onChange={(e) =>
                                                    setEstado(e.target.value)
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value="">
                                                    Todos los estados
                                                </option>
                                                <option value="activa">
                                                    Activa
                                                </option>
                                                <option value="pendiente">
                                                    Pendiente
                                                </option>
                                                <option value="vencida">
                                                    Vencida
                                                </option>
                                                <option value="cancelada">
                                                    Cancelada
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
                                                    className={`${selectBaseClass} bg-amber-50/60 border-amber-300 text-amber-950 focus:border-amber-500 focus:ring-amber-500`}
                                                >
                                                    <option value="sin_eliminados">
                                                        Activos únicamente
                                                    </option>
                                                    <option value="solo_eliminados">
                                                        Solo eliminados
                                                    </option>
                                                    <option value="con_eliminados">
                                                        Todos (Activos y
                                                        Eliminados)
                                                    </option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-amber-700 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2 border-t border-gray-100">
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
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tabla */}
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
                                                    ID / Boleta
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
                                                    ordenarPor("precio")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Precio
                                                    {indicadorOrden("precio")}
                                                </span>
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("fecha_inicio")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Inicio
                                                    {indicadorOrden(
                                                        "fecha_inicio",
                                                    )}
                                                </span>
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("fecha_fin")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Fin
                                                    {indicadorOrden(
                                                        "fecha_fin",
                                                    )}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {suscripciones.data.length > 0 ? (
                                            suscripciones.data.map(
                                                (sub: Subscription) => (
                                                    <tr
                                                        key={sub.id}
                                                        className={
                                                            sub.deleted_at
                                                                ? "bg-red-50/60 hover:bg-red-50"
                                                                : "hover:bg-gray-50/70"
                                                        }
                                                    >
                                                        <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            #{sub.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            {sub.client?.user
                                                                ?.name ||
                                                                `Cliente #${sub.client_id}`}
                                                        </td>
                                                        {!esCliente && (
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {sub.client
                                                                    ?.telefono ||
                                                                    "—"}
                                                            </td>
                                                        )}
                                                        {!esCliente && (
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {sub.client
                                                                    ?.user
                                                                    ?.email ||
                                                                    "—"}
                                                            </td>
                                                        )}
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {sub.plan?.nombre ||
                                                                `Plan #${sub.plan_id}`}
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                            $
                                                            {Number(
                                                                sub.precio,
                                                            ).toLocaleString(
                                                                "es-AR",
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {sub.fecha_inicio}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {sub.fecha_fin}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getEstadoBadgeClass(sub.estado)}`}
                                                                >
                                                                    {sub.estado.toUpperCase()}
                                                                </span>
                                                                {sub.deleted_at && (
                                                                    <span className="text-xs font-semibold text-red-600">
                                                                        (ELIMINADO)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {sub.deleted_at ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRestore(
                                                                            sub.id,
                                                                        )
                                                                    }
                                                                    className="inline-flex items-center whitespace-nowrap font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                                                                >
                                                                    <RotateCcw className="w-4 h-4 mr-1.5" />
                                                                    Restaurar
                                                                </button>
                                                            ) : (
                                                                <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap">
                                                                    <Link
                                                                        href={`/suscripciones/${sub.id}`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-gray-700 hover:text-indigo-600"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1.5" />
                                                                        Ver
                                                                    </Link>

                                                                    <Link
                                                                        href={`/suscripciones/${sub.id}/edit`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-indigo-600 hover:text-indigo-800"
                                                                    >
                                                                        <Pencil className="w-4 h-4 mr-1.5" />
                                                                        Editar
                                                                    </Link>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                sub.id,
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-red-600 hover:text-red-800 cursor-pointer"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-1.5" />
                                                                        Eliminar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={totalColumnas}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay suscripciones
                                                    registradas.
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
                                    {suscripciones.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {suscripciones.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {suscripciones.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {suscripciones.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                suscripciones.prev_page_url!,
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
                                        {suscripciones.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {suscripciones.last_page}
                                    </span>
                                </span>

                                {suscripciones.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                suscripciones.next_page_url!,
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
                title="¿Restaurar suscripción?"
                itemLabel={
                    suscripcionARestaurar
                        ? `Suscripción #${suscripcionARestaurar.id}${suscripcionARestaurar.client?.user?.name ? ` (${suscripcionARestaurar.client?.user?.name})` : ""}`
                        : undefined
                }
                description="La suscripción volverá a estar activa en el sistema."
                confirmText="Sí, restaurar suscripción"
            />

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Eliminar suscripción?"
                itemLabel={
                    suscripcionSeleccionada
                        ? `Suscripción #${suscripcionSeleccionada.id}${suscripcionSeleccionada.client?.user?.name ? ` (${suscripcionSeleccionada.client?.user?.name})` : ""}`
                        : undefined
                }
                description="Esta acción no se puede deshacer."
                confirmText="Sí, eliminar suscripción"
            />
        </>
    );
}
