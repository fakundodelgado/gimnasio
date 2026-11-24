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
} from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/confirmar-eliminacion";
import { ConfirmarRestauracion } from "@/components/confirmar-restauracion";
import { useAuth } from "@/hooks/use-auth";

interface Plan {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion: number;
    incluye_entrenador: boolean;
    deleted_at: string | null;
}

interface PlanesPaginados {
    data: Plan[];
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
    buscar: string;
    orden: string;
    direccion: string;
    paginas: number;
    papelera: string;
    incluye_entrenador: string;
    duracion: string;
}

interface Props {
    planes: PlanesPaginados;
    duraciones: number[];
    filtros: Filtros;
    esAdmin: boolean;
}

export default function Index({ planes, duraciones, filtros, esAdmin }: Props) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? "");
    const [incluyeEntrenador, setIncluyeEntrenador] = useState(
        filtros.incluye_entrenador ?? "",
    );
    const [duracion, setDuracion] = useState(
        filtros.duracion ? String(filtros.duracion) : "",
    );
    const [orden, setOrden] = useState(filtros.orden ?? "nombre");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "asc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );
    const { can } = useAuth();
    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/planes",
            {
                buscar,
                incluye_entrenador: incluyeEntrenador,
                duracion,
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
        setBuscar("");
        setIncluyeEntrenador("");
        setDuracion("");
        setOrden("nombre");
        setDireccion("asc");
        setPaginas(5);
        setPapelera("sin_eliminados");

        router.get("/planes");
    };

    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === "asc" ? "desc" : "asc";

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

    // Estados para el Modal de Confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const planSeleccionado = planes.data.find(
        (plan) => plan.id === idSeleccionado,
    );

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/planes/${idSeleccionado}`, {
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

    const planARestaurar = planes.data.find((plan) => plan.id === idARestaurar);

    const handleRestore = (id: number) => {
        setIdARestaurar(id);
        setIsRestoreModalOpen(true);
    };

    const ejecutarRestauracion = () => {
        if (!idARestaurar) return;
        setIsRestoring(true);
        router.patch(
            `/planes/${idARestaurar}/restore`,
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

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Listado de Planes" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-9xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Listado de Planes
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administrá los planes disponibles, precios,
                                duraciones y asignación de entrenadores.
                            </p>
                        </div>
                        {can("crear plan") && (
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/planes/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Plan
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
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Buscar
                                        </label>
                                        <input
                                            type="text"
                                            value={buscar}
                                            onChange={(e) =>
                                                setBuscar(e.target.value)
                                            }
                                            placeholder="Buscar por nombre..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Modalidad
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={incluyeEntrenador}
                                                onChange={(e) =>
                                                    setIncluyeEntrenador(
                                                        e.target.value,
                                                    )
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value="">
                                                    Modalidad: Todos
                                                </option>
                                                <option value="1">
                                                    Con entrenador
                                                </option>
                                                <option value="0">
                                                    Sin entrenador
                                                </option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Duración
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={duracion}
                                                onChange={(e) =>
                                                    setDuracion(e.target.value)
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value="">
                                                    Duración: Todas
                                                </option>
                                                {duraciones.map((dias) => (
                                                    <option
                                                        key={dias}
                                                        value={String(dias)}
                                                    >
                                                        {dias}{" "}
                                                        {dias === 1
                                                            ? "día"
                                                            : "días"}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
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
                                                <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
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

                    {/* Tabla de Planes */}
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
                                                    ID{indicadorOrden("id")}
                                                </span>
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("nombre")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Nombre
                                                    {indicadorOrden("nombre")}
                                                </span>
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
                                                    ordenarPor("duracion")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Duración (Días)
                                                    {indicadorOrden("duracion")}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Entrenador
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {planes.data.length > 0 ? (
                                            planes.data.map((plan: Plan) => (
                                                <tr
                                                    key={plan.id}
                                                    className={
                                                        plan.deleted_at
                                                            ? "bg-red-50/60 hover:bg-red-50"
                                                            : "hover:bg-gray-50/70"
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        #{plan.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="font-medium text-gray-900">
                                                                {plan.nombre}
                                                            </span>
                                                            {plan.deleted_at && (
                                                                <span className="text-xs font-semibold text-red-600">
                                                                    (ELIMINADO)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-semibold text-gray-900 whitespace-nowrap">
                                                        $
                                                        {Number(
                                                            plan.precio,
                                                        ).toLocaleString(
                                                            "es-AR",
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {plan.duracion} días
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {plan.incluye_entrenador ? (
                                                            <span className="inline-flex items-center font-semibold text-emerald-700">
                                                                ✓ Incluye
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                ✕ No incluye
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {plan.deleted_at ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRestore(
                                                                        plan.id,
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
                                                                    "mostrar plan",
                                                                ) && (
                                                                    <Link
                                                                        href={`/planes/${plan.id}`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-gray-700 hover:text-indigo-600"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1.5" />
                                                                        Detalles
                                                                    </Link>
                                                                )}
                                                                {can(
                                                                    "editar plan",
                                                                ) && (
                                                                    <Link
                                                                        href={`/planes/${plan.id}/edit`}
                                                                        className="inline-flex items-center whitespace-nowrap font-medium text-indigo-600 hover:text-indigo-800"
                                                                    >
                                                                        <Pencil className="w-4 h-4 mr-1.5" />
                                                                        Editar
                                                                    </Link>
                                                                )}
                                                                {can(
                                                                    "eliminar plan",
                                                                ) && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                plan.id,
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
                                                    colSpan={6}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay planes registrados
                                                    con los filtros actuales.
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
                                    {planes.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {planes.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {planes.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {planes.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                planes.prev_page_url!,
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
                                        {planes.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {planes.last_page}
                                    </span>
                                </span>

                                {planes.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                planes.next_page_url!,
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
                title="¿Restaurar plan?"
                itemLabel={planARestaurar?.nombre}
                description="El plan volverá a estar disponible."
                confirmText="Sí, restaurar plan"
            />

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Eliminar plan?"
                itemLabel={planSeleccionado?.nombre}
                description="Esta acción no se puede deshacer."
                confirmText="Sí, eliminar plan"
            />
        </>
    );
}
