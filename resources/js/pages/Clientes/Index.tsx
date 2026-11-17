import React, { useState, FormEvent, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";

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
        if (orden !== campo) return "";
        return direccion === "asc" ? " ↑" : " ↓";
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            router.delete(`/clientes/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Clientes</h2>

            <Link
                href="/clientes/create"
                style={{
                    display: "inline-block",
                    marginBottom: "15px",
                    padding: "8px 12px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "4px",
                    textDecoration: "none",
                }}
            >
                + Nuevo Cliente
            </Link>

            {/* Formulario de Búsqueda y Filtros */}
            <form
                onSubmit={aplicarFiltros}
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <input
                    type="text"
                    value={buscarTexto}
                    onChange={(e) => setBuscarTexto(e.target.value)}
                    placeholder="Buscar por nombre o email..."
                    style={{ padding: "6px 10px", minWidth: "220px" }}
                />

                <input
                    type="text"
                    value={buscarNumero}
                    onChange={(e) => setBuscarNumero(e.target.value)}
                    placeholder="Buscar por ID o teléfono..."
                    style={{ padding: "6px 10px", minWidth: "180px" }}
                />

                {/* Filtro por estado de última suscripción */}
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">Todos los estados</option>
                    <option value="activa">Suscripción Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencida">Vencida</option>
                    <option value="cancelada">Cancelada</option>
                    <option value="sin_suscripcion">Sin suscripción</option>
                </select>

                {/* SelectBuscador de Entrenadores (solo visible si no es rol trainer) */}
                {entrenadores.length > 0 && (
                    <div style={{ minWidth: "240px" }}>
                        <SelectBuscador
                            options={opcionesEntrenadores}
                            value={buscarEntrenador}
                            onChange={(val) => setBuscarEntrenador(String(val))}
                            placeholder="Filtrar por entrenador..."
                        />
                    </div>
                )}

                {/* Filtro de Papelera exclusivo para Admin / Super Admin */}
                {esAdmin && (
                    <select
                        value={papelera}
                        onChange={(e) => setPapelera(e.target.value)}
                        style={{
                            padding: "6px 10px",
                            background: "#fffbeb",
                            borderColor: "#f59e0b",
                        }}
                    >
                        <option value="sin_eliminados">
                            Activos únicamente
                        </option>
                        <option value="solo_eliminados">Solo eliminados</option>
                        <option value="con_eliminados">
                            Todos (Activos y Eliminados)
                        </option>
                    </select>
                )}

                <label style={{ fontSize: "14px" }}>
                    Mostrar:
                    <select
                        value={paginas}
                        onChange={(e) => setPaginas(Number(e.target.value))}
                        style={{ marginLeft: "5px", padding: "6px" }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>

                <button
                    type="submit"
                    style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={limpiarFiltros}
                    style={{
                        padding: "6px 12px",
                        cursor: "pointer",
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: "4px",
                    }}
                >
                    Limpiar
                </button>
            </form>

            {/* Tabla */}
            <table
                border={1}
                cellPadding="10"
                cellSpacing="0"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th
                            onClick={() => ordenarPor("id")}
                            style={{ cursor: "pointer" }}
                        >
                            N° Socio (ID){indicadorOrden("id")}
                        </th>
                        <th
                            onClick={() => ordenarPor("nombre")}
                            style={{ cursor: "pointer" }}
                        >
                            Nombre{indicadorOrden("nombre")}
                        </th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th
                            onClick={() => ordenarPor("created_at")}
                            style={{ cursor: "pointer" }}
                        >
                            Fecha Alta{indicadorOrden("created_at")}
                        </th>
                        <th>Última Suscripción</th>
                        <th>Entrenador</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.data.length > 0 ? (
                        clientes.data.map((cliente: Client) => {
                            const ultimoPlan = cliente.ultima_suscripcion?.plan;
                            const entrenador = cliente.trainer?.employee?.user;

                            return (
                                <tr
                                    key={cliente.id}
                                    style={{
                                        background: cliente.deleted_at
                                            ? "#fef2f2"
                                            : "transparent",
                                    }}
                                >
                                    <td>#{cliente.id}</td>
                                    <td>
                                        {cliente.user?.name ||
                                            `Cliente #${cliente.id}`}
                                        {cliente.deleted_at && (
                                            <span
                                                style={{
                                                    color: "red",
                                                    fontSize: "11px",
                                                    display: "block",
                                                }}
                                            >
                                                (ELIMINADO)
                                            </span>
                                        )}
                                    </td>
                                    <td>{cliente.user?.email || "-"}</td>
                                    <td>{cliente.telefono || "-"}</td>
                                    <td>
                                        {cliente.created_at
                                            ? new Date(
                                                  cliente.created_at,
                                              ).toLocaleDateString("es-AR")
                                            : "-"}
                                    </td>
                                    <td>
                                        {cliente.ultima_suscripcion ? (
                                            <div>
                                                <span
                                                    className={
                                                        cliente
                                                            .ultima_suscripcion
                                                            .estado === "activa"
                                                            ? "text-green-600 font-semibold"
                                                            : cliente
                                                                    .ultima_suscripcion
                                                                    .estado ===
                                                                "vencida"
                                                              ? "text-red-600 font-semibold"
                                                              : "text-gray-600"
                                                    }
                                                >
                                                    {
                                                        cliente
                                                            .ultima_suscripcion
                                                            .plan?.nombre
                                                    }
                                                </span>
                                                <span className="text-xs text-gray-500 block capitalize">
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
                                    <td>
                                        {entrenador ? (
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#2563eb",
                                                }}
                                            >
                                                {entrenador.name}
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "#9ca3af",
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                {ultimoPlan?.incluye_entrenador
                                                    ? "Pendiente"
                                                    : "No incluye"}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {cliente.deleted_at ? (
                                            /* Si está eliminado, mostramos el botón de Restaurar */
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "¿Estás seguro de que deseas restaurar este cliente?",
                                                        )
                                                    ) {
                                                        router.patch(
                                                            `/clientes/${cliente.id}/restore`,
                                                        );
                                                    }
                                                }}
                                                style={{
                                                    color: "green",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                }}
                                            >
                                                Restaurar
                                            </button>
                                        ) : (
                                            /* Si está activo, mostramos las acciones normales */
                                            <>
                                                <Link
                                                    href={`/clientes/${cliente.id}`}
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={`/clientes/${cliente.id}/edit`}
                                                    style={{
                                                        marginRight: "8px",
                                                    }}
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(cliente.id)
                                                    }
                                                    style={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                        background: "none",
                                                        border: "none",
                                                        padding: 0,
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center" }}>
                                No hay clientes registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginador */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                }}
            >
                <p style={{ fontSize: "14px" }}>
                    Mostrando {clientes.from ?? 0} a {clientes.to ?? 0} de{" "}
                    {clientes.total} resultados
                </p>
                <div>
                    {clientes.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    clientes.prev_page_url!,
                                    {},
                                    { preserveState: true },
                                )
                            }
                            style={{
                                marginRight: "10px",
                                padding: "6px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Anterior
                        </button>
                    )}
                    <span>
                        Página {clientes.current_page} de {clientes.last_page}
                    </span>
                    {clientes.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    clientes.next_page_url!,
                                    {},
                                    { preserveState: true },
                                )
                            }
                            style={{
                                marginLeft: "10px",
                                padding: "6px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
