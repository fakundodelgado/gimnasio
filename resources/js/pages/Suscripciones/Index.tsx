import React, { useState, FormEvent } from "react";
import { Link, usePage, router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
}

interface Client {
    id: number;
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
    buscar: string;
    estado: string;
    orden: string;
    direccion: string;
    por_pagina: number;
    papelera: string;
}

interface PageProps {
    flash: { success?: string };
    suscripciones: SuscripcionesPaginadas;
    filtros: Filtros;
    esAdmin: boolean;
    [key: string]: unknown;
}

export default function Index({
    suscripciones,
    filtros,
    esAdmin,
}: {
    suscripciones: SuscripcionesPaginadas;
    filtros: Filtros;
    esAdmin: boolean;
}) {
    const { flash } = usePage<PageProps>().props;

    const [buscar, setBuscar] = useState(filtros.buscar ?? "");
    const [estado, setEstado] = useState(filtros.estado ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "fecha_inicio");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [porPagina, setPorPagina] = useState(filtros.por_pagina ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        router.get("/suscripciones", {
            buscar,
            estado,
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

        router.get("/suscripciones", {
            buscar,
            estado,
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
        if (confirm("¿Estás seguro de que deseas eliminar esta suscripción?")) {
            router.delete(`/suscripciones/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Suscripciones</h2>

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
                href="/suscripciones/create"
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
                + Nueva Suscripción
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
                    placeholder="Buscar por cliente o N° boleta (ID)..."
                    style={{ padding: "6px 10px", minWidth: "240px" }}
                />

                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencida">Vencida</option>
                    <option value="cancelada">Cancelada</option>
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
                            ID / Boleta{indicadorOrden("id")}
                        </th>
                        <th>Cliente</th>
                        <th>Plan</th>
                        <th
                            onClick={() => ordenarPor("precio")}
                            style={{ cursor: "pointer" }}
                        >
                            Precio{indicadorOrden("precio")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_inicio")}
                            style={{ cursor: "pointer" }}
                        >
                            Inicio{indicadorOrden("fecha_inicio")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_fin")}
                            style={{ cursor: "pointer" }}
                        >
                            Fin{indicadorOrden("fecha_fin")}
                        </th>
                        <th
                            onClick={() => ordenarPor("estado")}
                            style={{ cursor: "pointer" }}
                        >
                            Estado{indicadorOrden("estado")}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suscripciones.data.length > 0 ? (
                        suscripciones.data.map((sub: Subscription) => (
                            <tr
                                key={sub.id}
                                style={{
                                    background: sub.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>#{sub.id}</td>
                                <td>
                                    {sub.client?.user?.name ||
                                        `Cliente #${sub.client_id}`}
                                </td>
                                <td>
                                    {sub.plan?.nombre || `Plan #${sub.plan_id}`}
                                </td>
                                <td>
                                    $
                                    {Number(sub.precio).toLocaleString("es-AR")}
                                </td>
                                <td>{sub.fecha_inicio}</td>
                                <td>{sub.fecha_fin}</td>
                                <td>
                                    {sub.estado.toUpperCase()}
                                    {sub.deleted_at && (
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
                                <td>
                                    {!sub.deleted_at && (
                                        <>
                                            <Link
                                                href={`/suscripciones/${sub.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/suscripciones/${sub.id}/edit`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(sub.id)
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
                            <td colSpan={8} style={{ textAlign: "center" }}>
                                No hay suscripciones registradas.
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
                    Mostrando {suscripciones.from ?? 0} a{" "}
                    {suscripciones.to ?? 0} de {suscripciones.total} resultados
                </p>
                <div>
                    {suscripciones.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(suscripciones.prev_page_url!)
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
                        Página {suscripciones.current_page} de{" "}
                        {suscripciones.last_page}
                    </span>
                    {suscripciones.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(suscripciones.next_page_url!)
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
