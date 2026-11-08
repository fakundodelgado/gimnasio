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
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
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
    console.log("DATOS SUSCRIPCION:", suscripcion);
    console.log("DATOS CLIENTES:", clientes);
    // 1. Inicializamos useForm manteniendo los tipos number para los IDs
    const { data, setData, put, processing, errors } = useForm<{
        client_id: number | string;
        trainer_id?: number | string;
        plan_id: number | string;
        precio: number | string;
        fecha_inicio: string;
        fecha_fin: string;
        estado: string;
    }>({
        client_id: suscripcion?.client_id ?? "",
        trainer_id: suscripcion?.trainer_id ?? "",
        plan_id: suscripcion?.plan_id ?? "",
        precio: suscripcion?.precio ?? "",
        fecha_inicio: suscripcion?.fecha_inicio ?? "",
        fecha_fin: suscripcion?.fecha_fin ?? "",
        estado: suscripcion?.estado ?? "activa",
    });

    // 2. Mapeo de opciones asegurando IDs numéricos o convertidos
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

    const opcionesClientes: SelectOption[] = clientes.map((c) => ({
        id: c.id,
        label: `#${c.id} - ${c.user?.name || "Sin nombre"}`,
        sublabel: c.user?.email || undefined,
    }));

    // 3. Plan seleccionado (usando comparación estricta con Number)
    const planSeleccionado = planes.find(
        (p) => Number(p.id) === Number(data.plan_id),
    );

    const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedPlanId = Number(e.target.value);
        const plan = planes.find((p) => Number(p.id) === selectedPlanId);

        let nuevaFechaFin = data.fecha_fin;
        if (plan && data.fecha_inicio) {
            const fecha = new Date(data.fecha_inicio);
            fecha.setDate(fecha.getDate() + plan.duracion);
            nuevaFechaFin = fecha.toISOString().split("T")[0];
        }

        setData((prev) => ({
            ...prev,
            plan_id: selectedPlanId,
            precio: plan ? String(plan.precio) : "",
            fecha_fin: nuevaFechaFin,
            trainer_id: plan?.incluye_entrenador ? prev.trainer_id : "",
        }));
    };

    const handleFechaInicioChange = (e: ChangeEvent<HTMLInputElement>) => {
        const nuevaFechaInicio = e.target.value;
        let nuevaFechaFin = data.fecha_fin;

        if (planSeleccionado && nuevaFechaInicio) {
            const fecha = new Date(nuevaFechaInicio);
            fecha.setDate(fecha.getDate() + planSeleccionado.duracion);
            nuevaFechaFin = fecha.toISOString().split("T")[0];
        }

        setData((prev) => ({
            ...prev,
            fecha_inicio: nuevaFechaInicio,
            fecha_fin: nuevaFechaFin,
        }));
    };

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
            <h2>Editar Suscripción #{suscripcion?.id}</h2>

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
                    <div className="mb-4">
                        <SelectBuscador
                            label="Cliente"
                            options={opcionesClientes}
                            value={data.client_id}
                            onChange={(id) => setData("client_id", id)}
                            placeholder="Buscar cliente por número o nombre..."
                            error={errors.client_id}
                        />
                    </div>
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
                    <label>Entrenador:</label>
                    {planSeleccionado?.incluye_entrenador ? (
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
                            {data.plan_id
                                ? "El plan seleccionado no requiere ni incluye entrenador."
                                : "Selecciona un plan para asignar entrenador."}
                        </p>
                    )}
                </div>

                <div>
                    <label>Precio:</label>
                    <p>{data.precio || "Seleccionar un plan"}</p>
                </div>

                <div>
                    <label>Fecha de Inicio:</label>
                    <input
                        type="date"
                        value={data.fecha_inicio}
                        onChange={handleFechaInicioChange}
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
                    <p>{data.fecha_fin || "Seleccionar un plan"}</p>
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
