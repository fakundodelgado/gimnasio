import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

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

interface PageProps {
    flash: {
        success?: string;
    };
    turnos: Turn[];
    [key: string]: unknown;
}

export default function Index({ turnos }: { turnos: Turn[] }) {
    const { flash } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este turno?")) {
            router.delete(`/turnos/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Turnos</h2>

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
                href="/turnos/create"
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
                + Nuevo Turno
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
                        <th>Día</th>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Entrenador</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {turnos && turnos.length > 0 ? (
                        turnos.map((turno: Turn) => (
                            <tr key={turno.id}>
                                <td>{turno.id}</td>
                                <td>{turno.dia}</td>
                                <td>{turno.hora}</td>
                                <td>
                                    {turno.client?.user?.name ||
                                        `Cliente #${turno.client_id}`}
                                </td>
                                <td>
                                    {turno.trainer?.employee?.user?.name ||
                                        `Entrenador #${turno.trainer_id}`}
                                </td>
                                <td>
                                    <Link
                                        href={`/turnos/${turno.id}`}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Ver
                                    </Link>
                                    <Link
                                        href={`/turnos/${turno.id}/edit`}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(turno.id)}
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
                            <td colSpan={6} style={{ textAlign: "center" }}>
                                No hay turnos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
