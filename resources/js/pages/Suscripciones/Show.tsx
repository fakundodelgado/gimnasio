import React from "react";
import { Link } from "@inertiajs/react";

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
    precio: number | string;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    client?: Client;
    plan?: Plan;
}

export default function Show({ suscripcion }: { suscripcion: Subscription }) {
    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Detalle de Suscripción #{suscripcion.id}</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#fafafa",
                }}
            >
                <p>
                    <strong>Cliente:</strong>{" "}
                    {suscripcion.client?.user?.name ||
                        `Cliente #${suscripcion.client_id}`}
                </p>
                <p>
                    <strong>Plan Contratado:</strong>{" "}
                    {suscripcion.plan?.nombre || `Plan #${suscripcion.plan_id}`}
                </p>
                <p>
                    <strong>Precio Mantenido:</strong> $
                    {Number(suscripcion.precio).toLocaleString("es-AR")}
                </p>
                <p>
                    <strong>Fecha de Inicio:</strong> {suscripcion.fecha_inicio}
                </p>
                <p>
                    <strong>Fecha de Vencimiento:</strong>{" "}
                    {suscripcion.fecha_fin}
                </p>
                <p>
                    <strong>Estado:</strong> {suscripcion.estado.toUpperCase()}
                </p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Link
                    href={`/suscripciones/${suscripcion.id}/edit`}
                    style={{
                        padding: "8px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "4px",
                        textDecoration: "none",
                        marginRight: "10px",
                    }}
                >
                    Editar
                </Link>
                <Link href="/suscripciones">Volver al listado</Link>
            </div>
        </div>
    );
}
