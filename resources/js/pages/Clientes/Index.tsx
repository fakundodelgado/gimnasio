import React, { useState, FormEvent } from "react";
import { Link, usePage, router } from "@inertiajs/react";

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
    direccion?: string;
    deleted_at: string | null;
    user?: User;
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
    buscar: string;
    orden: string;
    direccion: string;
    por_pagina: number;
    papelera: string;
}

interface PageProps {
    flash: { success?: string };
    clientes: ClientesPaginados;
    filtros: Filtros;
    esAdmin: boolean;
    [key: string]: unknown;
}

export default function Index({
    clientes,
    filtros,
    esAdmin,
}: {
    clientes: ClientesPaginados;
    filtros: Filtros;
    esAdmin: boolean;
}) {
    const { flash } = usePage<PageProps>().props;

    const [buscar, setBuscar] = useState(filtros.buscar ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "id");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "asc");
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get("/clientes", {
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

        router.get("/clientes", {
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
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            router.delete(`/clientes/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Clientes</h2>

            {flash?.success && (
                <div
                    style={{
                        color: "green",
                        marginBottom: "15px",
                        fontWeight: "bold",
                    }}
                >
                    {flash.success}
                </div>
            )}

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
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                    placeholder="Buscar por cliente, email o N° socio (ID)..."
                    style={{ padding: "6px 10px", minWidth: "260px" }}
                />

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
                        <option value="todos">
                            Todos (Activos y Eliminados)
                        </option>
                    </select>
                )}

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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.data.length > 0 ? (
                        clientes.data.map((cliente: Client) => (
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
                                    {!cliente.deleted_at && (
                                        <>
                                            <Link
                                                href={`/clientes/${cliente.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/clientes/${cliente.id}/edit`}
                                                style={{ marginRight: "8px" }}
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
                            <td colSpan={5} style={{ textAlign: "center" }}>
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
                            onClick={() => router.get(clientes.prev_page_url!)}
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
                            onClick={() => router.get(clientes.next_page_url!)}
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
