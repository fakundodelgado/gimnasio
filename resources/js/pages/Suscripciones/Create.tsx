import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";

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
    duracion: number;
    incluye_entrenador: boolean;
}

interface Props {
    clientes: Client[];
    planes: Plan[];
    inicio: string;
}

export default function Create({ clientes, planes, inicio }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: "",
        plan_id: "",
        precio: "",
        estado: "activa",
    });

    // Encuentro el plan seleccionado
    const planSeleccionado = planes.find((p) => p.id === Number(data.plan_id));

    const fechaFin = () => {
        if (!planSeleccionado) {
            return "Seleccionar un plan";
        }

        const fecha = new Date(inicio);
        fecha.setDate(fecha.getDate() + planSeleccionado.duracion);
        // Para que tenga el mismo formato que el otro...
        return fecha.toISOString().split("T")[0];
    };

    const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedPlanId = e.target.value;
        const plan = planes.find((p) => p.id === parseInt(selectedPlanId));

        setData((prev) => ({
            ...prev,
            plan_id: selectedPlanId,
            precio: plan ? String(plan.precio) : prev.precio,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/suscripciones");
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Crear Nueva Suscripción</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div>
                    <label>Cliente:</label>
                    <select
                        value={data.client_id}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("client_id", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="">-- Seleccionar Cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.user ? c.user.name : `Cliente #${c.id}`}
                            </option>
                        ))}
                    </select>
                    {errors.client_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.client_id}
                        </div>
                    )}
                </div>

                <div>
                    <label>Plan:</label>
                    <select
                        value={data.plan_id}
                        onChange={handlePlanChange}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="">-- Seleccionar Plan --</option>
                        {planes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} (${p.precio})
                            </option>
                        ))}
                    </select>
                    {errors.plan_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.plan_id}
                        </div>
                    )}
                </div>

                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={data.precio}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("precio", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.precio && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.precio}
                        </div>
                    )}
                </div>

                <div>
                    <label>Fecha de Inicio:</label>
                    <p>{inicio}</p>
                </div>

                <div>
                    <label>Fecha de Vencimiento:</label>
                    <p>{fechaFin()}</p>
                </div>

                <div>
                    <label>Estado:</label>
                    <select
                        value={data.estado}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("estado", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="activa">Activa</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="vencida">Vencida</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                    {errors.estado && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.estado}
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
                        Guardar Suscripción
                    </button>
                    <Link href="/suscripciones">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
