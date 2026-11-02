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

interface Plan {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    plan?: Plan;
}

interface Payment {
    id: number;
    monto: number | string;
    fecha_pago: string;
    metodo_pago: string;
    subscription_id: number;
    employee_id: number;
    subscription?: Subscription;
    employee?: Employee;
}

interface PageProps {
    flash: {
        success?: string;
    };
    pagos: Payment[];
    [key: string]: unknown;
}

export default function Index({ pagos }: { pagos: Payment[] }) {
    const { flash } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar este pago?")) {
            router.delete(`/pagos/${id}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Pagos</h2>

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
                + Registrar Pago
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
                        <th>Monto</th>
                        <th>Fecha de Pago</th>
                        <th>Método</th>
                        <th>Suscripción / Plan</th>
                        <th>Registrado por</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos && pagos.length > 0 ? (
                        pagos.map((pago: Payment) => (
                            <tr key={pago.id}>
                                <td>{pago.id}</td>
                                <td>
                                    $
                                    {Number(pago.monto).toLocaleString("es-AR")}
                                </td>
                                <td>{pago.fecha_pago}</td>
                                <td>
                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            background: "#e0f2fe",
                                            color: "#0369a1",
                                            textTransform: "capitalize",
                                        }}
                                    >
                                        {pago.metodo_pago}
                                    </span>
                                </td>
                                <td>
                                    {pago.subscription?.plan?.nombre
                                        ? `Suscripción #${pago.subscription_id} (${pago.subscription.plan.nombre})`
                                        : `Suscripción #${pago.subscription_id}`}
                                </td>
                                <td>
                                    {pago.employee?.user?.name ||
                                        `Empleado #${pago.employee_id}`}
                                </td>
                                <td>
                                    <Link
                                        href={`/pagos/${pago.id}`}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Ver
                                    </Link>
                                    <Link
                                        href={`/pagos/${pago.id}/edit`}
                                        style={{ marginRight: "8px" }}
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(pago.id)}
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
                            <td colSpan={7} style={{ textAlign: "center" }}>
                                No hay pagos registrados.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
