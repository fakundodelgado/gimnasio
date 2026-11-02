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

export default function Show({ pago }: { pago: Payment }) {
    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Detalle de Pago #{pago.id}</h2>

            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#fafafa",
                }}
            >
                <p>
                    <strong>Monto:</strong> $
                    {Number(pago.monto).toLocaleString("es-AR")}
                </p>
                <p>
                    <strong>Fecha de Pago:</strong> {pago.fecha_pago}
                </p>
                <p>
                    <strong>Método de Pago:</strong>{" "}
                    {pago.metodo_pago.toUpperCase()}
                </p>
                <p>
                    <strong>Suscripción Asociada:</strong> Suscripción #
                    {pago.subscription_id}{" "}
                    {pago.subscription?.plan?.nombre
                        ? `(${pago.subscription.plan.nombre})`
                        : ""}
                </p>
                <p>
                    <strong>Empleado Registrador:</strong>{" "}
                    {pago.employee?.user?.name ||
                        `Empleado #${pago.employee_id}`}
                </p>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Link
                    href={`/pagos/${pago.id}/edit`}
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
                <Link href="/pagos">Volver al listado</Link>
            </div>
        </div>
    );
}
