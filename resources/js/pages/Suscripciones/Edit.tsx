import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { SelectBuscador, SelectOption } from "@/components/SelectBuscador";

interface User {
    id: number;
    name: string;
    email?: string;
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

interface Employee {
    id: number;
    user?: User;
    cuil?: string;
}

interface Trainer {
    id: number;
    especialidad: string;
    limite_alumnos: number;
    clients_count?: number;
    employee?: Employee;
}

interface Subscription {
    id: number;
    client_id: number;
    trainer_id?: number | null;
    plan_id: number;
    precio?: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    client?: Client;
    plan?: Plan;
}

interface Props {
    suscripcion: Subscription;
    clientes: Client[];
    planes: Plan[];
    entrenadores: Trainer[];
}

export default function Edit({
    suscripcion,
    clientes,
    planes,
    entrenadores,
}: Props) {
    const { data, setData, put, processing, errors } = useForm<{
        trainer_id?: number | string;
        estado: string;
    }>({
        trainer_id: suscripcion?.trainer_id ?? "",
        estado: suscripcion?.estado ?? "activa",
    });

    const clienteActual = clientes.find(
        (c) => Number(c.id) === Number(suscripcion?.client_id),
    );
    const planActual = planes.find(
        (p) => Number(p.id) === Number(suscripcion?.plan_id),
    );

    const opcionesEntrenadores: SelectOption[] = entrenadores.map((tr) => {
        const esSuEntrenadorActual =
            Number(tr.id) === Number(suscripcion?.trainer_id);
        const lleno =
            !esSuEntrenadorActual &&
            (tr.clients_count ?? 0) >= tr.limite_alumnos;
        const nombre = tr.employee?.user?.name || `Entrenador #${tr.id}`;
        const cuil = tr.employee?.cuil || "Sin CUIL";

        return {
            id: tr.id,
            label: `${cuil} - ${nombre} (${tr.especialidad})`,
            sublabel: lleno
                ? "CUPO LLENO"
                : `${tr.clients_count ?? 0}/${tr.limite_alumnos} Alumnos`,
            disabled: lleno,
        };
    });

    const esVigente =
        suscripcion.estado === "activa" || suscripcion.estado === "pendiente";

    const hoy = new Date().toISOString().split("T")[0];

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/suscripciones/${suscripcion.id}`);
    };

    const readOnlyStyle: React.CSSProperties = {
        width: "100%",
        padding: "8px",
        backgroundColor: "#f3f4f6",
        border: "1px solid #d1d5db",
        borderRadius: "4px",
        color: "#4b5563",
        cursor: "not-allowed",
        marginTop: "5px",
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Editar Suscripción #{suscripcion?.id}</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                {/* Cliente (Solo Lectura) */}
                <div>
                    <label>Cliente:</label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={readOnlyStyle}
                        value={
                            clienteActual
                                ? `#${clienteActual.id} - ${clienteActual.user?.name || "Sin nombre"}`
                                : `#${suscripcion.client_id}`
                        }
                    />
                </div>

                {/* Plan (Solo Lectura) */}
                <div>
                    <label>Plan Contratado:</label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={readOnlyStyle}
                        value={
                            planActual
                                ? `${planActual.nombre} ($${planActual.precio})`
                                : `Plan #${suscripcion.plan_id}`
                        }
                    />
                </div>

                {/* Entrenador (Editable solo si el plan lo incluye y no está cancelando) */}
                <div>
                    <label>Entrenador:</label>
                    {planActual?.incluye_entrenador ? (
                        <div className="mb-4">
                            <SelectBuscador
                                label="Entrenador Asignado"
                                options={opcionesEntrenadores}
                                value={data.trainer_id}
                                onChange={(id) => setData("trainer_id", id)}
                                placeholder="Buscar por CUIL, nombre o especialidad..."
                                error={errors.trainer_id}
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic py-2">
                            Este plan no incluye entrenador.
                        </p>
                    )}
                </div>

                {/* Fecha de Inicio (Solo Lectura) */}
                <div>
                    <label>Fecha de Inicio:</label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={readOnlyStyle}
                        value={suscripcion.fecha_inicio}
                    />
                </div>

                {/* Fecha de Fin / Vencimiento */}
                <div>
                    <label>Fecha de Fin / Vencimiento:</label>
                    <input
                        type="text"
                        disabled
                        readOnly
                        style={readOnlyStyle}
                        value={
                            data.estado === "cancelada" &&
                            suscripcion.estado !== "cancelada"
                                ? `${hoy} (se cortará hoy al cancelar)`
                                : suscripcion.fecha_fin
                        }
                    />
                </div>

                {/* Estado (Solo permite mantener estado actual o cancelar si estaba vigente) */}
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
                        <option value={suscripcion.estado}>
                            {suscripcion.estado.charAt(0).toUpperCase() +
                                suscripcion.estado.slice(1)}{" "}
                            (Estado actual)
                        </option>
                        {esVigente && (
                            <option value="cancelada">
                                Cancelar suscripción
                            </option>
                        )}
                    </select>
                    <small
                        style={{
                            color: "#6b7280",
                            display: "block",
                            marginTop: "4px",
                        }}
                    >
                        Los cambios entre Pendiente y Activa se gestionan
                        automáticamente desde el módulo de Pagos.
                    </small>
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
