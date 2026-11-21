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

interface User {
    id: number;
    name: string;
    email: string;
    deleted_at?: string | null;
}

interface Trainer {
    id: number;
    especialidad?: string | null;
    deleted_at?: string | null;
}

interface Employee {
    id: number;
    user_id: number;
    cuil: string;
    telefono?: string;
    created_at?: string;
    deleted_at: string | null;
    user?: User;
    trainer?: Trainer | null;
}

interface EmpleadosPaginados {
    data: Employee[];
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
    buscar_texto: string;
    buscar_numero: string;
    orden: string;
    direccion: string;
    papelera: string;
    tipo: string;
    paginas: number;
}

interface Props {
    empleados: EmpleadosPaginados;
    filtros: Filtros;
    esAdmin: boolean;
}

export default function Index({ empleados, filtros, esAdmin }: Props) {
    const [buscarTexto, setBuscarTexto] = useState(filtros.buscar_texto ?? "");
    const [buscarNumero, setBuscarNumero] = useState(
        filtros.buscar_numero ?? "",
    );
    const [orden, setOrden] = useState(filtros.orden ?? "id");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "asc");
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );
    const [tipo, setTipo] = useState(filtros.tipo ?? "");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const { can } = useAuth();
    const construirParametros = (overrides: Partial<Filtros> = {}) => ({
        buscar_texto: buscarTexto,
        buscar_numero: buscarNumero,
        orden,
        direccion,
        papelera,
        tipo,
        paginas,
        ...overrides,
    });

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get("/empleados", construirParametros(), {
            preserveState: true,
            replace: true,
        });
    };

    const limpiarFiltros = () => {
        setBuscarTexto("");
        setBuscarNumero("");
        setOrden("id");
        setDireccion("asc");
        setPapelera("sin_eliminados");
        setTipo("");
        setPaginas(5);

        router.get("/empleados");
    };

    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === "asc" ? "desc" : "asc";
        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get(
            "/empleados",
            construirParametros({ orden: campo, direccion: nuevaDireccion }),
            { preserveState: true, replace: true },
        );
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

    const empleadoSeleccionado = empleados.data.find(
        (empleado) => empleado.id === idSeleccionado,
    );

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/empleados/${idSeleccionado}`, {
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

    const empleadoARestaurar = empleados.data.find(
        (empleado) => empleado.id === idARestaurar,
    );

    const handleRestore = (id: number) => {
        setIdARestaurar(id);
        setIsRestoreModalOpen(true);
    };

    const ejecutarRestauracion = () => {
        if (!idARestaurar) return;
        setIsRestoring(true);
        router.patch(
            `/empleados/${idARestaurar}/restore`,
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

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Listado de Empleados" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-8xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Listado de Empleados
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administrá el personal del gimnasio, CUIL, datos
                                de contacto y perfiles asignados.
                            </p>
                        </div>
                        {can("crear empleado") && (
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/empleados/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Empleado
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
                                            Nombre o Email
                                        </label>
                                        <input
                                            type="text"
                                            value={buscarTexto}
                                            onChange={(e) =>
                                                setBuscarTexto(e.target.value)
                                            }
                                            placeholder="Buscar por nombre o email..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Legajo, CUIL o Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            value={buscarNumero}
                                            onChange={(e) =>
                                                setBuscarNumero(e.target.value)
                                            }
                                            placeholder="Buscar por ID, CUIL o teléfono..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Perfil
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={tipo}
                                                onChange={(e) =>
                                                    setTipo(e.target.value)
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value="">
                                                    Todos los perfiles
                                                </option>
                                                <option value="entrenador">
                                                    Con perfil de entrenador
                                                </option>
                                                <option value="administrativo">
                                                    Administrativo (sin
                                                    entrenador)
                                                </option>
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
                                                    N° Legajo (ID)
                                                    {indicadorOrden("id")}
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
                                                    ordenarPor("cuil")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    CUIL{indicadorOrden("cuil")}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Teléfono
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Perfil
                                            </th>
                                            <th
                                                onClick={() =>
                                                    ordenarPor("created_at")
                                                }
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Fecha Alta
                                                    {indicadorOrden(
                                                        "created_at",
                                                    )}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {empleados.data.length > 0 ? (
                                            empleados.data.map(
                                                (emp: Employee) => (
                                                    <tr
                                                        key={emp.id}
                                                        className={
                                                            emp.deleted_at
                                                                ? "bg-red-50/60 hover:bg-red-50"
                                                                : "hover:bg-gray-50/70"
                                                        }
                                                    >
                                                        <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            #{emp.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <span className="font-medium text-gray-900">
                                                                    {emp.user
                                                                        ?.name ||
                                                                        `Empleado #${emp.id}`}
                                                                </span>
                                                                {emp.deleted_at && (
                                                                    <span className="text-xs font-semibold text-red-600">
                                                                        (ELIMINADO)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.cuil || "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.user?.email ||
                                                                "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.telefono ||
                                                                "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.trainer ? (
                                                                <div className="flex flex-col items-center">
                                                                    <span className="font-semibold text-indigo-600">
                                                                        Entrenador
                                                                    </span>
                                                                    {emp.trainer
                                                                        .especialidad && (
                                                                        <span className="text-xs text-gray-500">
                                                                            (
                                                                            {
                                                                                emp
                                                                                    .trainer
                                                                                    .especialidad
                                                                            }
                                                                            )
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 italic">
                                                                    Administrativo
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.created_at
                                                                ? new Date(
                                                                      emp.created_at,
                                                                  ).toLocaleDateString(
                                                                      "es-AR",
                                                                  )
                                                                : "—"}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {emp.deleted_at ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRestore(
                                                                            emp.id,
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
                                                                        "mostrar empleado",
                                                                    ) && (
                                                                        <Link
                                                                            href={`/empleados/${emp.id}`}
                                                                            className="inline-flex items-center whitespace-nowrap font-medium text-gray-700 hover:text-indigo-600"
                                                                        >
                                                                            <Eye className="w-4 h-4 mr-1.5" />
                                                                            Ver
                                                                        </Link>
                                                                    )}
                                                                    {can(
                                                                        "editar empleado",
                                                                    ) && (
                                                                        <Link
                                                                            href={`/empleados/${emp.id}/edit`}
                                                                            className="inline-flex items-center whitespace-nowrap font-medium text-indigo-600 hover:text-indigo-800"
                                                                        >
                                                                            <Pencil className="w-4 h-4 mr-1.5" />
                                                                            Editar
                                                                        </Link>
                                                                    )}
                                                                    {can(
                                                                        "eliminar empleado",
                                                                    ) && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    emp.id,
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
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay empleados
                                                    registrados.
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
                                    {empleados.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {empleados.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {empleados.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {empleados.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                empleados.prev_page_url!,
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
                                        {empleados.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {empleados.last_page}
                                    </span>
                                </span>

                                {empleados.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                empleados.next_page_url!,
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
                title="¿Restaurar empleado?"
                itemLabel={empleadoARestaurar?.user?.name}
                description="El empleado volverá a estar activo en el sistema."
                confirmText="Sí, restaurar empleado"
            />

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Eliminar empleado?"
                itemLabel={empleadoSeleccionado?.user?.name}
                description="Esta acción no se puede deshacer."
                confirmText="Sí, eliminar empleado"
            />
        </>
    );
}
