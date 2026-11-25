import React, { useState, FormEvent, useMemo } from "react";
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
import { useAuth } from "@/hooks/use-auth";

interface User {
    id: number;
    name: string;
    email: string;
    deleted_at?: string | null;
}

interface Plan {
    id: number;
    nombre: string;
    incluye_entrenador: boolean;
}

interface UltimaSuscripcion {
    id: number;
    estado: string;
    plan?: Plan;
}

interface Trainer {
    id: number;
    especialidad?: string | null;
    employee?: {
        user?: User;
    };
}

interface Client {
    id: number;
    user_id: number;
    telefono?: string;
    direccion?: string;
    created_at?: string;
    deleted_at: string | null;
    user?: User;
    ultima_suscripcion?: UltimaSuscripcion | null;
    trainer?: Trainer | null;
}

interface ClientesPaginados {
    data: Client[];
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
    buscar_entrenador: string;
    orden: string;
    direccion: string;
    papelera: string;
    estado: string;
    paginas: number;
}

interface Props {
    clientes: ClientesPaginados;
    filtros: Filtros;
    entrenadores: Trainer[];
    esAdmin: boolean;
}

export default function Index({
    clientes,
    filtros,
    entrenadores,
    esAdmin,
}: Props) {
    const [buscarTexto, setBuscarTexto] = useState(filtros.buscar_texto ?? "");
    const [buscarNumero, setBuscarNumero] = useState(
        filtros.buscar_numero ?? "",
    );
    const [buscarEntrenador, setBuscarEntrenador] = useState(
        String(filtros.buscar_entrenador ?? ""),
    );
    const [orden, setOrden] = useState(filtros.orden ?? "id");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "asc");
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );
    const { can } = useAuth();
    const [estado, setEstado] = useState(filtros.estado ?? "");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);

    const opcionesEntrenadores = useMemo(() => {
        const lista = entrenadores.map((trainer) => {
            const nombre =
                trainer.employee?.user?.name ?? `Entrenador #${trainer.id}`;
            const esp = trainer.especialidad
                ? ` (${trainer.especialidad})`
                : "";
            return {
                id: String(trainer.id),
                label: `#${trainer.id} - ${nombre}${esp}`,
            };
        });

        return [
            { id: "", label: "Todos los entrenadores" },
            { id: "sin_entrenador", label: "Sin entrenador asignado" },
            ...lista,
        ];
    }, [entrenadores]);

    const construirParametros = (overrides: Partial<Filtros> = {}) => ({
        buscar_texto: buscarTexto,
        buscar_numero: buscarNumero,
        buscar_entrenador: buscarEntrenador,
        orden,
        direccion,
        papelera,
        estado,
        paginas,
        ...overrides,
    });

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get("/clientes", construirParametros(), {
            preserveState: true,
            replace: true,
        });
    };

    const limpiarFiltros = () => {
        setBuscarTexto("");
        setBuscarNumero("");
        setBuscarEntrenador("");
        setOrden("id");
        setDireccion("asc");
        setPapelera("sin_eliminados");
        setEstado("");
        setPaginas(5);

        router.get("/clientes");
    };

    const ordenarPor = (campo: string) => {
        const nuevaDireccion =
            orden === campo && direccion === "asc" ? "desc" : "asc";
        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get(
            "/clientes",
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const clienteSeleccionado = clientes.data.find(
        (cliente) => cliente.id === idSeleccionado,
    );

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/clientes/${idSeleccionado}`, {
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

    const clienteARestaurar = clientes.data.find(
        (cliente) => cliente.id === idARestaurar,
    );

    const handleRestore = (id: number) => {
        setIdARestaurar(id);
        setIsRestoreModalOpen(true);
    };

    const ejecutarRestauracion = () => {
        if (!idARestaurar) return;
        setIsRestoring(true);
        router.patch(
            `/clientes/${idARestaurar}/restore`,
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

    const getEstadoSuscripcionClass = (estadoValor: string) => {
        switch (estadoValor.toLowerCase()) {
            case "activa":
                return "text-emerald-700 font-semibold";
            case "vencida":
                return "text-red-600 font-semibold";
            case "pendiente":
                return "text-amber-700 font-semibold";
            default:
                return "text-gray-700 font-medium";
        }
    };

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Listado de Clientes" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-8xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Listado de Clientes
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestioná los socios registrados, su estado de
                                suscripción y entrenadores asignados.
                            </p>
                        </div>
                        {can("crear cliente") && (
                            <Button
                                asChild
                                className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href="/clientes/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Cliente
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
                                            N° Socio o Teléfono
                                        </label>
                                        <input
                                            type="text"
                                            value={buscarNumero}
                                            onChange={(e) =>
                                                setBuscarNumero(e.target.value)
                                            }
                                            placeholder="Buscar por ID o teléfono..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Estado de Suscripción
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
                                                    Suscripción Activa
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
                                                <option value="sin_suscripcion">
                                                    Sin suscripción
                                                </option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    {entrenadores.length > 0 && (
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Entrenador
                                            </label>
                                            <SelectBuscador
                                                options={opcionesEntrenadores}
                                                value={buscarEntrenador}
                                                onChange={(val) =>
                                                    setBuscarEntrenador(
                                                        String(val),
                                                    )
                                                }
                                                placeholder="Filtrar por entrenador..."
                                            />
                                        </div>
                                    )}

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
                                                    N° Socio (ID)
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
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Teléfono
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
                                                Última Suscripción
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
                                        {clientes.data.length > 0 ? (
                                            clientes.data.map(
                                                (cliente: Client) => {
                                                    const ultimoPlan =
                                                        cliente
                                                            .ultima_suscripcion
                                                            ?.plan;
                                                    const entrenador =
                                                        cliente.trainer
                                                            ?.employee?.user;

                                                    return (
                                                        <tr
                                                            key={cliente.id}
                                                            className={
                                                                cliente.deleted_at
                                                                    ? "bg-red-50/60 hover:bg-red-50"
                                                                    : "hover:bg-gray-50/70"
                                                            }
                                                        >
                                                            <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                                #{cliente.id}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                <div className="flex flex-col items-center gap-0.5">
                                                                    <span className="font-medium text-gray-900">
                                                                        {cliente
                                                                            .user
                                                                            ?.name ||
                                                                            `Cliente #${cliente.id}`}
                                                                    </span>
                                                                    {cliente.deleted_at && (
                                                                        <span className="text-xs font-semibold text-red-600">
                                                                            (ELIMINADO)
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {cliente.user
                                                                    ?.email ||
                                                                    "—"}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {cliente.telefono ||
                                                                    "—"}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {cliente.created_at
                                                                    ? new Date(
                                                                          cliente.created_at,
                                                                      ).toLocaleDateString(
                                                                          "es-AR",
                                                                      )
                                                                    : "—"}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {cliente.ultima_suscripcion ? (
                                                                    <div className="flex flex-col items-center">
                                                                        <span
                                                                            className={getEstadoSuscripcionClass(
                                                                                cliente
                                                                                    .ultima_suscripcion
                                                                                    .estado,
                                                                            )}
                                                                        >
                                                                            {
                                                                                cliente
                                                                                    .ultima_suscripcion
                                                                                    .plan
                                                                                    ?.nombre
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 capitalize">
                                                                            (
                                                                            {
                                                                                cliente
                                                                                    .ultima_suscripcion
                                                                                    .estado
                                                                            }
                                                                            )
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400 italic">
                                                                        Sin plan
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {entrenador ? (
                                                                    <span className="font-semibold text-indigo-600">
                                                                        {
                                                                            entrenador.name
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-400 italic">
                                                                        {ultimoPlan?.incluye_entrenador
                                                                            ? "Pendiente"
                                                                            : "No incluye"}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                                {cliente.deleted_at ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRestore(
                                                                                cliente.id,
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center whitespace-nowrap font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                                                                    >
                                                                        <RotateCcw className="w-4 h-4 mr-1.5" />
                                                                        Dar de
                                                                        alta
                                                                    </button>
                                                                ) : (
                                                                    <div className="inline-flex items-center justify-center gap-3 whitespace-nowrap">
                                                                        {can(
                                                                            "mostrar cliente",
                                                                        ) && (
                                                                            <Link
                                                                                href={`/clientes/${cliente.id}`}
                                                                                className="inline-flex items-center whitespace-nowrap font-medium text-gray-700 hover:text-indigo-600"
                                                                            >
                                                                                <Eye className="w-4 h-4 mr-1.5" />
                                                                                Detalles
                                                                            </Link>
                                                                        )}
                                                                        {can(
                                                                            "editar cliente",
                                                                        ) && (
                                                                            <Link
                                                                                href={`/clientes/${cliente.id}/edit`}
                                                                                className="inline-flex items-center whitespace-nowrap font-medium text-indigo-600 hover:text-indigo-800"
                                                                            >
                                                                                <Pencil className="w-4 h-4 mr-1.5" />
                                                                                Editar
                                                                            </Link>
                                                                        )}
                                                                        {can(
                                                                            "eliminar cliente",
                                                                        ) && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        cliente.id,
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center whitespace-nowrap font-medium text-red-600 hover:text-red-800 cursor-pointer"
                                                                            >
                                                                                <Trash2 className="w-4 h-4 mr-1.5" />
                                                                                Dar
                                                                                de
                                                                                baja
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                },
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay clientes registrados.
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
                                    {clientes.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {clientes.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {clientes.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {clientes.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                clientes.prev_page_url!,
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
                                        {clientes.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {clientes.last_page}
                                    </span>
                                </span>

                                {clientes.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                clientes.next_page_url!,
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
                title="¿Dar de alta al cliente?"
                itemLabel={clienteARestaurar?.user?.name}
                description="El cliente volverá a estar activo en el sistema."
                confirmText="Sí, restaurar cliente"
            />

            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Dar de baja al cliente?"
                itemLabel={clienteSeleccionado?.user?.name}
                description="¿Desea continuar?."
                confirmText="Sí, eliminar cliente"
            />
        </>
    );
}
