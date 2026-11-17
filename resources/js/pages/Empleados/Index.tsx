import React, { useState, FormEvent } from "react";
import { Link, router } from "@inertiajs/react";

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
        if (orden !== campo) return "";
        return direccion === "asc" ? " ↑" : " ↓";
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
            router.delete(`/empleados/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Empleados</h2>

            <Link
                href="/empleados/create"
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
                + Nuevo Empleado
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
                    placeholder="Buscar por ID, CUIL o teléfono..."
                    style={{ padding: "6px 10px", minWidth: "210px" }}
                />

                {/* Filtro por tipo de empleado */}
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">Todos los perfiles</option>
                    <option value="entrenador">Con perfil de entrenador</option>
                    <option value="administrativo">
                        Administrativo (sin entrenador)
                    </option>
                </select>

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
                            N° Legajo (ID){indicadorOrden("id")}
                        </th>
                        <th
                            onClick={() => ordenarPor("nombre")}
                            style={{ cursor: "pointer" }}
                        >
                            Nombre{indicadorOrden("nombre")}
                        </th>
                        <th
                            onClick={() => ordenarPor("cuil")}
                            style={{ cursor: "pointer" }}
                        >
                            CUIL{indicadorOrden("cuil")}
                        </th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Perfil</th>
                        <th
                            onClick={() => ordenarPor("created_at")}
                            style={{ cursor: "pointer" }}
                        >
                            Fecha Alta{indicadorOrden("created_at")}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empleados.data.length > 0 ? (
                        empleados.data.map((emp: Employee) => (
                            <tr
                                key={emp.id}
                                style={{
                                    background: emp.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>#{emp.id}</td>
                                <td>
                                    {emp.user?.name || `Empleado #${emp.id}`}
                                    {emp.deleted_at && (
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
                                <td>{emp.cuil || "-"}</td>
                                <td>{emp.user?.email || "-"}</td>
                                <td>{emp.telefono || "-"}</td>
                                <td>
                                    {emp.trainer ? (
                                        <div>
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    color: "#2563eb",
                                                }}
                                            >
                                                Entrenador
                                            </span>
                                            {emp.trainer.especialidad && (
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#6b7280",
                                                        display: "block",
                                                    }}
                                                >
                                                    ({emp.trainer.especialidad})
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span
                                            style={{
                                                color: "#6b7280",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            Administrativo
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {emp.created_at
                                        ? new Date(
                                              emp.created_at,
                                          ).toLocaleDateString("es-AR")
                                        : "-"}
                                </td>
                                <td>
                                    {emp.deleted_at ? (
                                        /* Si el empleado está eliminado, mostramos el botón de Restaurar */
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "¿Estás seguro de que deseas restaurar este empleado?",
                                                    )
                                                ) {
                                                    router.patch(
                                                        `/empleados/${emp.id}/restore`,
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
                                                href={`/empleados/${emp.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/empleados/${emp.id}/edit`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(emp.id)
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center" }}>
                                No hay empleados registrados.
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
                    Mostrando {empleados.from ?? 0} a {empleados.to ?? 0} de{" "}
                    {empleados.total} resultados
                </p>
                <div>
                    {empleados.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    empleados.prev_page_url!,
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
                        Página {empleados.current_page} de {empleados.last_page}
                    </span>
                    {empleados.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    empleados.next_page_url!,
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
