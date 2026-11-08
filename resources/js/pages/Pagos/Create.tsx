import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { SelectBuscador, SelectOption } from "@/components/SelectBuscador";

interface User {
    id: number;
    name: string;
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

interface Props {
    fecha: string;
    suscripciones: Subscription[];
}

export default function Create({ fecha, suscripciones }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        monto: "",
        subscription_id: "",
        metodo_pago: "efectivo",
    });

    // Mapeo para el SelectBuscador
    const opcionesSuscripciones = suscripciones.map((s) => {
        const clientName =
            s.client?.user?.name || `Cliente #${s.client?.id || s.id}`;
        const planName = s.plan?.nombre || "Plan N/A";

        return {
            id: s.id,
            label: `#${s.id} - ${clientName} (${planName})`,
        };
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/pagos");
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Registrar Nuevo Pago</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                        Suscripción a Pagar (Buscar por Boleta o Cliente):
                    </label>
                    <SelectBuscador
                        options={opcionesSuscripciones}
                        value={data.subscription_id}
                        onChange={(id) =>
                            setData("subscription_id", String(id))
                        }
                        placeholder="Buscar por boleta o cliente..."
                        error={errors.subscription_id}
                    />
                    {errors.subscription_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.subscription_id}
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
                    <p style={{ margin: "5px 0", fontWeight: "bold" }}>
                        {fecha}
                    </p>
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
                            background: "#16a34a",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}
                    >
                        Guardar Pago
                    </button>
                    <Link href="/pagos">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
