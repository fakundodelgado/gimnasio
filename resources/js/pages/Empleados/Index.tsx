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
    deleted_at: string | null;
    user?: User;
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
    buscar: string;
    orden: string;
    direccion: string;
    por_pagina: number;
    papelera: string;
}

interface PageProps {
    empleados: EmpleadosPaginados;
    filtros: Filtros;
    [key: string]: unknown;
}

export default function Index({
    empleados,
    filtros,
}: {
    empleados: EmpleadosPaginados;
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
        router.get("/empleados", {
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

        router.get("/empleados", {
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
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    placeholder="Buscar por nombre, email, CUIL o N° Legajo..."
                    style={{ padding: "6px 10px", minWidth: "280px" }}
                />

                {/* Papelera directa (Acceso exclusivo de Admin / Super Admin) */}
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
                                    {!emp.deleted_at && (
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
                            onClick={() => router.get(empleados.prev_page_url!)}
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
                            onClick={() => router.get(empleados.next_page_url!)}
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
