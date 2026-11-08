import React, { FormEvent, ChangeEvent } from "react";
import { useForm, Link } from "@inertiajs/react";
import { SelectBuscador, SelectOption } from "@/components/SelectBuscador";

interface User {
    id: number;
    name: string;
    email: string;
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

interface Props {
    clientes: Client[];
    planes: Plan[];
    entrenadores: Trainer[];
    inicio: string;
}

export default function Create({
    clientes,
    planes,
    inicio,
    entrenadores,
}: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        client_id: number | string;
        trainer_id?: number | string;
        plan_id: number | string;
        precio: number | string;
        estado: string;
    }>({
        client_id: "",
        trainer_id: "",
        plan_id: "",
        precio: "",
        estado: "activa",
    });

    const opcionesEntrenadores: SelectOption[] = entrenadores.map((tr) => {
        const lleno = (tr.clients_count ?? 0) >= tr.limite_alumnos;
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

    const precioPlan = () => {
        if (!planSeleccionado) {
            return "Seleccionar un plan";
        }

        return planSeleccionado.precio;
    };

    const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedPlanId = e.target.value;
        const plan = planes.find((p) => p.id === Number(selectedPlanId));

        setData((prev) => ({
            ...prev,
            plan_id: selectedPlanId,
            precio: plan ? String(plan.precio) : "",
            trainer_id: plan?.incluye_entrenador ? prev.trainer_id : "",
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
                    <p>{precioPlan()}</p>
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
