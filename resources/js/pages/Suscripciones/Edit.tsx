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
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
}

interface Props {
    suscripcion: Subscription;
    clientes: Client[];
    planes: Plan[];
}

export default function Edit({ suscripcion, clientes, planes }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: String(suscripcion.client_id || ""),
        plan_id: String(suscripcion.plan_id || ""),
        precio: String(suscripcion.precio || ""),
        fecha_inicio: suscripcion.fecha_inicio || "",
        fecha_fin: suscripcion.fecha_fin || "",
        estado: suscripcion.estado || "activa",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/suscripciones/${suscripcion.id}`);
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Editar Suscripción #{suscripcion.id}</h2>

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
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("plan_id", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
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
                    <input
                        type="date"
                        value={data.fecha_inicio}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("fecha_inicio", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.fecha_inicio && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.fecha_inicio}
                        </div>
                    )}
                </div>

                <div>
                    <label>Fecha de Fin / Vencimiento:</label>
                    <input
                        type="date"
                        value={data.fecha_fin}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("fecha_fin", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.fecha_fin && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.fecha_fin}
                        </div>
                    )}
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
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}
                    >
                        Actualizar Suscripción
                    </button>
                    <Link href="/suscripciones">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
