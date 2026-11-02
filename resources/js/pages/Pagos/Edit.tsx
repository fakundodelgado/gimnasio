import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";

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

interface Client {
    id: number;
    user?: User;
}

interface Subscription {
    id: number;
    plan?: Plan;
    client?: Client;
}

interface Payment {
    id: number;
    monto: number | string;
    fecha_pago: string;
    subscription_id: number;
    employee_id: number;
    metodo_pago: string;
}

interface Props {
    pago: Payment;
    empleados: Employee[];
    suscripciones: Subscription[];
}

export default function Edit({ pago, empleados, suscripciones }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        monto: String(pago.monto || ""),
        fecha_pago: pago.fecha_pago || "",
        subscription_id: String(pago.subscription_id || ""),
        employee_id: String(pago.employee_id || ""),
        metodo_pago: pago.metodo_pago || "efectivo",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/pagos/${pago.id}`);
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Editar Pago #{pago.id}</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div>
                    <label>Suscripción:</label>
                    <select
                        value={data.subscription_id}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("subscription_id", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        {suscripciones.map((s) => {
                            const clientName =
                                s.client?.user?.name || `Cliente #${s.id}`;
                            const planName = s.plan?.nombre || "Plan N/A";
                            return (
                                <option key={s.id} value={s.id}>
                                    Suscripción #{s.id} - {clientName} (
                                    {planName})
                                </option>
                            );
                        })}
                    </select>
                    {errors.subscription_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.subscription_id}
                        </div>
                    )}
                </div>

                <div>
                    <label>Empleado que Registra:</label>
                    <select
                        value={data.employee_id}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("employee_id", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        {empleados.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.user ? e.user.name : `Empleado #${e.id}`}
                            </option>
                        ))}
                    </select>
                    {errors.employee_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.employee_id}
                        </div>
                    )}
                </div>

                <div>
                    <label>Monto:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.monto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("monto", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.monto && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.monto}
                        </div>
                    )}
                </div>

                <div>
                    <label>Fecha de Pago:</label>
                    <input
                        type="date"
                        value={data.fecha_pago}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("fecha_pago", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.fecha_pago && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.fecha_pago}
                        </div>
                    )}
                </div>

                <div>
                    <label>Método de Pago:</label>
                    <select
                        value={data.metodo_pago}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("metodo_pago", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                    {errors.metodo_pago && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.metodo_pago}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: "10px" }}>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            padding: "8px 16px",
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}
                    >
                        Actualizar Pago
                    </button>
                    <Link href="/pagos">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
