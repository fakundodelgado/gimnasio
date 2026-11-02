import React from "react";
import { Link } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    user?: User;
}

interface Trainer {
    id: number;
    employee?: Employee;
}

interface Client {
    id: number;
    user?: User;
}

interface Turn {
    id: number;
    dia: string;
    hora: string;
    client_id: number;
    trainer_id: number;
    client?: Client;
    trainer?: Trainer;
}

export default function Show({ turno }: { turno: Turn }) {
    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Detalle de Turno #{turno.id}</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#fafafa",
                }}
            >
                <p>
                    <strong>Día:</strong> {turno.dia}
                </p>
                <p>
                    <strong>Hora:</strong> {turno.hora}
                </p>
                <p>
                    <strong>Cliente:</strong>{" "}
                    {turno.client?.user?.name || `Cliente #${turno.client_id}`}
                </p>
                <p>
                    <strong>Entrenador Asignado:</strong>{" "}
                    {turno.trainer?.employee?.user?.name ||
                        `Entrenador #${turno.trainer_id}`}
                </p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Link
                    href={`/turnos/${turno.id}/edit`}
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
                <Link href="/turnos">Volver al listado</Link>
            </div>
        </div>
    );
}
