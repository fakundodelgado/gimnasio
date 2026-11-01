import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Client {
    id: number;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number | string;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: "activa" | "vencida" | "pendiente" | "cancelada";
    client?: Client;
    plan?: Plan;
}

interface PageProps {
    flash: {
        success?: string;
    };
    suscripciones: Subscription[];
    [key: string]: unknown;
}

export default function Index({
    suscripciones,
}: {
    suscripciones: Subscription[];
}) {
    const { flash } = usePage<PageProps>().props;

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
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Plan</th>
                        <th>Precio</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suscripciones.length > 0 ? (
                        suscripciones.map((sub: Subscription) => (
                            <tr key={sub.id}>
                                <td>{sub.id}</td>
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
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            background:
                                                sub.estado === "activa"
                                                    ? "#dcfce7"
                                                    : sub.estado === "vencida"
                                                      ? "#fee2e2"
                                                      : "#fef3c7",
                                            color:
                                                sub.estado === "activa"
                                                    ? "#166534"
                                                    : sub.estado === "vencida"
                                                      ? "#991b1b"
                                                      : "#92400e",
                                        }}
                                    >
                                        {sub.estado.toUpperCase()}
                                    </span>
                                </td>
                                <td>
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
                                        onClick={() => handleDelete(sub.id)}
                                        style={{
                                            color: "red",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Eliminar
                                    </button>
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
        </div>
    );
}
