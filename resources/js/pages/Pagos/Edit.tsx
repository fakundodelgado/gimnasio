import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";

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
    precio?: number | string;
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
    employee?: Employee;
    subscription?: Subscription;
}

interface Props {
    pago: Payment;
    suscripciones: Subscription[];
}

export default function Edit({ pago, suscripciones }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        subscription_id: String(pago.subscription_id || ""),
        metodo_pago: pago.metodo_pago || "efectivo",
    });

    const precioPlanActual = Number(pago.subscription?.plan?.precio || 0);
    const esPagoCompleto =
        precioPlanActual > 0 && Number(pago.monto) >= precioPlanActual;

    const opcionesSuscripciones = suscripciones.map((s) => {
        const clientName =
            s.client?.user?.name || `Cliente #${s.client?.id || s.id}`;
        const planName = s.plan?.nombre || "Plan N/A";
        return {
            id: s.id,
            label: `#${s.id} - ${clientName} (${planName})`,
        };
    });

    const suscripcionActualLabel =
        opcionesSuscripciones.find(
            (op) => String(op.id) === String(pago.subscription_id),
        )?.label || `#${pago.subscription_id}`;

    const cambioSuscripcion =
        String(data.subscription_id) !== String(pago.subscription_id);

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
                {/* Empleado Auditado (Solo Lectura) */}
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Registrado por (Empleado):
                    </label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#f3f4f6",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            color: "#4b5563",
                            cursor: "not-allowed",
                        }}
                        value={
                            pago.employee?.user
                                ? `#${pago.employee.id} - ${pago.employee.user.name}`
                                : "Sin empleado registrado"
                        }
                    />
                </div>

                {/* Fecha de Pago Original (Solo Lectura) */}
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Fecha de Pago:
                    </label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#f3f4f6",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            color: "#4b5563",
                            cursor: "not-allowed",
                        }}
                        value={pago.fecha_pago}
                    />
                </div>

                {/* Buscador de Suscripción (bloqueado si es pago por el 100% del plan) */}
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Suscripción:
                    </label>
                    {esPagoCompleto ? (
                        <>
                            <input
                                type="text"
                                disabled
                                readOnly
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    backgroundColor: "#f3f4f6",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    color: "#4b5563",
                                    cursor: "not-allowed",
                                }}
                                value={suscripcionActualLabel}
                            />
                            <small
                                style={{
                                    color: "#6b7280",
                                    display: "block",
                                    marginTop: "4px",
                                }}
                            >
                                Este pago cubre el 100% del plan y no puede
                                reasignarse a otra suscripción.
                            </small>
                        </>
                    ) : (
                        <SelectBuscador
                            options={opcionesSuscripciones}
                            value={data.subscription_id}
                            onChange={(id) =>
                                setData("subscription_id", String(id))
                            }
                            placeholder="Buscar por boleta o cliente..."
                            error={errors.subscription_id}
                        />
                    )}
                </div>

                {/* Monto (Solo Lectura) */}
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Monto:
                    </label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={{
                            width: "100%",
                            padding: "8px",
                            backgroundColor: "#f3f4f6",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            color: "#4b5563",
                            cursor: "not-allowed",
                        }}
                        value={
                            cambioSuscripcion
                                ? "Se recalculará automáticamente según el saldo de la nueva suscripción"
                                : `$${Number(pago.monto).toFixed(2)}`
                        }
                    />
                </div>

                {/* Método de Pago */}
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
