import React, { useState, FormEvent } from "react";
import { Link, usePage, router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
    deleted_at?: string | null;
}

interface Employee {
    id: number;
    user_id: number;
    cuil: string;
    telefono?: string;
    deleted_at?: string | null;
    user?: User;
}

interface Trainer {
    id: number;
    employee_id: number;
    especialidad: string;
    limite_alumnos: number;
    clients_count?: number;
    deleted_at: string | null;
    employee?: Employee;
}

interface EntrenadoresPaginados {
    data: Trainer[];
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
    por_pagina: number;
    papelera: string;
}

interface PageProps {
    entrenadores: EntrenadoresPaginados;
    filtros: Filtros;
    [key: string]: unknown;
}

export default function Index({
    entrenadores,
    filtros,
}: {
    entrenadores: EntrenadoresPaginados;
    filtros: Filtros;
}) {
    const [buscar, setBuscar] = useState(filtros.buscar ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "id");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "asc");
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get("/entrenadores", {
            buscar,
            orden,
            direccion,
            por_pagina: porPagina,
            papelera,
        });
    };

    const ordenarPor = (campo: string) => {
        let nuevaDireccion = "asc";
        if (orden === campo && direccion === "asc") {
            nuevaDireccion = "desc";
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);

        router.get("/entrenadores", {
            buscar,
            orden: campo,
            direccion: nuevaDireccion,
            por_pagina: porPagina,
            papelera,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return "";
        return direccion === "asc" ? " ↑" : " ↓";
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este entrenador?")) {
            router.delete(`/entrenadores/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Entrenadores</h2>

            <Link
                href="/entrenadores/create"
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
                + Nuevo Entrenador
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
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    placeholder="Buscar por nombre, email, CUIL, especialidad o ID..."
                    style={{ padding: "6px 10px", minWidth: "280px" }}
                />

                <select
                    value={papelera}
                    onChange={(e) => setPapelera(e.target.value)}
                    style={{
                        padding: "6px 10px",
                        background: "#fffbeb",
                        borderColor: "#f59e0b",
                    }}
                >
                    <option value="sin_eliminados">Activos únicamente</option>
                    <option value="solo_eliminados">Solo eliminados</option>
                    <option value="todos">Todos (Activos y Eliminados)</option>
                </select>

                <label style={{ fontSize: "14px" }}>
                    Mostrar:
                    <select
                        value={porPagina}
                        onChange={(e) => setPorPagina(Number(e.target.value))}
                        style={{ marginLeft: "5px", padding: "6px" }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>

                <button
                    type="submit"
                    style={{ padding: "6px 12px", cursor: "pointer" }}
                >
                    Buscar
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
                            ID{indicadorOrden("id")}
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
                        <th
                            onClick={() => ordenarPor("especialidad")}
                            style={{ cursor: "pointer" }}
                        >
                            Especialidad{indicadorOrden("especialidad")}
                        </th>
                        <th>Cupo de Alumnos</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {entrenadores.data.length > 0 ? (
                        entrenadores.data.map((tr: Trainer) => (
                            <tr
                                key={tr.id}
                                style={{
                                    background: tr.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>#{tr.id}</td>
                                <td>
                                    {tr.employee?.user?.name ||
                                        `Entrenador #${tr.id}`}
                                    {tr.deleted_at && (
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
                                <td>{tr.employee?.cuil || "-"}</td>
                                <td>{tr.especialidad || "-"}</td>
                                <td>
                                    {tr.clients_count ?? 0} /{" "}
                                    {tr.limite_alumnos}
                                </td>
                                <td>{tr.employee?.user?.email || "-"}</td>
                                <td>
                                    {!tr.deleted_at && (
                                        <>
                                            <Link
                                                href={`/entrenadores/${tr.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/entrenadores/${tr.id}/edit`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(tr.id)
                                                }
                                                style={{
                                                    color: "red",
                                                    cursor: "pointer",
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
                            <td colSpan={6} style={{ textAlign: "center" }}>
                                No hay entrenadores registrados.
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
                    Mostrando {entrenadores.from ?? 0} a {entrenadores.to ?? 0}{" "}
                    de {entrenadores.total} resultados
                </p>
                <div>
                    {entrenadores.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(entrenadores.prev_page_url!)
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
                        Página {entrenadores.current_page} de{" "}
                        {entrenadores.last_page}
                    </span>
                    {entrenadores.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(entrenadores.next_page_url!)
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
