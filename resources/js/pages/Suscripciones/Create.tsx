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
        estado: string;
        metodo_pago: string;
    }>({
        client_id: "",
        trainer_id: "",
        plan_id: "",
        estado: "activa",
        metodo_pago: "efectivo",
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

    const planSeleccionado = planes.find((p) => p.id === Number(data.plan_id));

    const fechaFin = () => {
        if (!planSeleccionado) {
            return "Seleccionar un plan";
        }

        const fecha = new Date(inicio);
        fecha.setDate(fecha.getDate() + planSeleccionado.duracion);
        return fecha.toISOString().split("T")[0];
    };

    const montoInicial = () => {
        if (!planSeleccionado) return null;
        const precio = Number(planSeleccionado.precio);
        return data.estado === "pendiente" ? precio / 2 : precio;
    };

    const handlePlanChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedPlanId = e.target.value;
        const plan = planes.find((p) => p.id === Number(selectedPlanId));

        setData((prev) => ({
            ...prev,
            plan_id: selectedPlanId,
            trainer_id: plan?.incluye_entrenador ? prev.trainer_id : "",
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/suscripciones");
    };

    const montoACobrar = montoInicial();

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
                    <label>Precio Total del Plan:</label>
                    <p style={{ margin: "4px 0", fontWeight: "bold" }}>
                        {planSeleccionado
                            ? `$${Number(planSeleccionado.precio).toFixed(2)}`
                            : "Seleccionar un plan"}
                    </p>
                </div>

                <div>
                    <label>Fecha de Inicio:</label>
                    <p style={{ margin: "4px 0" }}>{inicio}</p>
                </div>

                <div>
                    <label>Fecha de Vencimiento:</label>
                    <p style={{ margin: "4px 0" }}>{fechaFin()}</p>
                </div>

                <div>
                    <label>Modalidad / Estado Inicial:</label>
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
                        <option value="activa">
                            Activa (Pago completo 100%)
                        </option>
                        <option value="pendiente">
                            Pendiente (Pago inicial 50%)
                        </option>
                    </select>
                    {errors.estado && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.estado}
                        </div>
                    )}
                </div>

                <div>
                    <label>Método de Pago Inicial:</label>
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

                {montoACobrar !== null && (
                    <div
                        style={{
                            padding: "10px",
                            backgroundColor: "#ecfdf5",
                            border: "1px solid #a7f3d0",
                            borderRadius: "4px",
                            color: "#065f46",
                            fontWeight: "bold",
                        }}
                    >
                        Se registrará automáticamente un pago inicial de $
                        {montoACobrar.toFixed(2)}
                    </div>
                )}

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
