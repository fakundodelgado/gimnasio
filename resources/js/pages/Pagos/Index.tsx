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
    deleted_at?: string | null;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    client?: Client;
    plan?: Plan;
}

interface Employee {
    id: number;
    user_id: number;
    deleted_at?: string | null;
    user?: User;
}

interface Payment {
    id: number;
    subscription_id: number;
    employee_id?: number;
    monto: number;
    fecha_pago: string;
    metodo_pago: string;
    deleted_at: string | null;
    subscription?: Subscription;
    employee?: Employee;
}

interface PagosPaginados {
    data: Payment[];
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
    pagos: PagosPaginados;
    filtros: Filtros;
    esAdmin: boolean;
    [key: string]: unknown;
}

export default function Index({
    pagos,
    filtros,
    esAdmin,
}: {
    pagos: PagosPaginados;
    filtros: Filtros;
    esAdmin: boolean;
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
        router.get("/pagos", {
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

        router.get("/pagos", {
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
        if (confirm("¿Estás seguro de que deseas anular/eliminar este pago?")) {
            router.delete(`/pagos/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Historial de Pagos y Caja</h2>

            <Link
                href="/pagos/create"
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
                + Registrar Nuevo Pago
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
                    placeholder="Buscar por cliente, empleado, ID pago o ID suscripción..."
                    style={{ padding: "6px 10px", minWidth: "320px" }}
                />

                {/* Solo se muestra el selector de papelera si el usuario es Admin/Super */}
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
                        <option value="sin_eliminados">Pagos activos</option>
                        <option value="solo_eliminados">
                            Solo anulados/eliminados
                        </option>
                        <option value="todos">
                            Todos (Activos y Anulados)
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

            {/* Tabla de Pagos */}
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
                            Comprobante #{indicadorOrden("id")}
                        </th>
                        <th>Cliente</th>
                        <th>Plan</th>
                        <th
                            onClick={() => ordenarPor("monto")}
                            style={{ cursor: "pointer" }}
                        >
                            Monto{indicadorOrden("monto")}
                        </th>
                        <th
                            onClick={() => ordenarPor("metodo_pago")}
                            style={{ cursor: "pointer" }}
                        >
                            Método{indicadorOrden("metodo_pago")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_pago")}
                            style={{ cursor: "pointer" }}
                        >
                            Fecha{indicadorOrden("fecha_pago")}
                        </th>
                        <th>Cobrado Por</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.data.length > 0 ? (
                        pagos.data.map((pago: Payment) => (
                            <tr
                                key={pago.id}
                                style={{
                                    background: pago.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>
                                    #{pago.id} (Sub #{pago.subscription_id})
                                </td>
                                <td>
                                    {pago.subscription?.client?.user?.name ??
                                        "Cliente N/A"}
                                    {pago.subscription?.client?.deleted_at && (
                                        <span
                                            style={{
                                                color: "gray",
                                                fontSize: "11px",
                                                display: "block",
                                            }}
                                        >
                                            (Cliente Eliminado)
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {pago.subscription?.plan?.nombre ??
                                        "Plan N/A"}
                                </td>
                                <td>
                                    <strong>
                                        $
                                        {Number(pago.monto).toLocaleString(
                                            "es-AR",
                                        )}
                                    </strong>
                                </td>
                                <td>
                                    <span
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {pago.metodo_pago}
                                    </span>
                                </td>
                                <td>
                                    {new Date(
                                        pago.fecha_pago,
                                    ).toLocaleDateString("es-AR")}
                                </td>
                                <td>
                                    {pago.employee?.user?.name ??
                                        "Sistema / Admin"}
                                </td>
                                <td>
                                    {!pago.deleted_at ? (
                                        <>
                                            <Link
                                                href={`/pagos/${pago.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            {esAdmin && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(pago.id)
                                                    }
                                                    style={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Anular
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                color: "red",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            ANULADO
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: "center" }}>
                                No hay registros de pagos.
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
                    Mostrando {pagos.from ?? 0} a {pagos.to ?? 0} de{" "}
                    {pagos.total} resultados
                </p>
                <div>
                    {pagos.prev_page_url && (
                        <button
                            onClick={() => router.get(pagos.prev_page_url!)}
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
                        Página {pagos.current_page} de {pagos.last_page}
                    </span>
                    {pagos.next_page_url && (
                        <button
                            onClick={() => router.get(pagos.next_page_url!)}
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
