import React, { useState, FormEvent } from "react";
import { Link, usePage, router } from "@inertiajs/react";

interface Plan {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracion: number; // Duración en días
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
    por_pagina: number;
    papelera: string;
}

interface PageProps {
    flash: { success?: string };
    planes: PlanesPaginados;
    filtros: Filtros;
    [key: string]: unknown;
}

export default function Index({
    planes,
    filtros,
}: {
    planes: PlanesPaginados;
    filtros: Filtros;
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
        router.get("/planes", {
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

        router.get("/planes", {
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
        if (confirm("¿Estás seguro de que deseas eliminar este plan?")) {
            router.delete(`/planes/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Planes</h2>

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
                href="/planes/create"
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
                + Nuevo Plan
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
                    placeholder="Buscar por nombre o ID..."
                    style={{ padding: "6px 10px", minWidth: "250px" }}
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

            {/* Tabla de Planes */}
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
                            onClick={() => ordenarPor("precio")}
                            style={{ cursor: "pointer" }}
                        >
                            Precio{indicadorOrden("precio")}
                        </th>
                        <th
                            onClick={() => ordenarPor("duracion")}
                            style={{ cursor: "pointer" }}
                        >
                            Duración (Días){indicadorOrden("duracion")}
                        </th>
                        <th
                            onClick={() => ordenarPor("incluye_entrenador")}
                            style={{ cursor: "pointer" }}
                        >
                            Entrenador{indicadorOrden("incluye_entrenador")}
                        </th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {planes.data.length > 0 ? (
                        planes.data.map((plan: Plan) => (
                            <tr
                                key={plan.id}
                                style={{
                                    background: plan.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>#{plan.id}</td>
                                <td>
                                    {plan.nombre}
                                    {plan.deleted_at && (
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
                                    $
                                    {Number(plan.precio).toLocaleString(
                                        "es-AR",
                                    )}
                                </td>
                                <td>{plan.duracion} días</td>
                                <td>
                                    {plan.incluye_entrenador ? (
                                        <span
                                            style={{
                                                fontWeight: "bold",
                                                color: "#16a34a",
                                            }}
                                        >
                                            ✓ Incluye
                                        </span>
                                    ) : (
                                        <span style={{ color: "#6b7280" }}>
                                            ✕ No incluye
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {!plan.deleted_at && (
                                        <>
                                            <Link
                                                href={`/planes/${plan.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/planes/${plan.id}/edit`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(plan.id)
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
                                No hay planes registrados.
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
                    Mostrando {planes.from ?? 0} a {planes.to ?? 0} de{" "}
                    {planes.total} resultados
                </p>
                <div>
                    {planes.prev_page_url && (
                        <button
                            onClick={() => router.get(planes.prev_page_url!)}
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
                        Página {planes.current_page} de {planes.last_page}
                    </span>
                    {planes.next_page_url && (
                        <button
                            onClick={() => router.get(planes.next_page_url!)}
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
