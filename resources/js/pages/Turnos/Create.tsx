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

interface Trainer {
    id: number;
    employee?: Employee;
}

interface Client {
    id: number;
    user?: User;
}

interface Props {
    clientes: Client[];
    entrenadores: Trainer[];
}

export default function Create({ clientes, entrenadores }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        dia: "Lunes",
        hora: "",
        client_id: "",
        trainer_id: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post("/turnos");
    };

    return (
        <div
            style={{
                padding: "20px",
                maxWidth: "600px",
                fontFamily: "sans-serif",
            }}
        >
            <h2>Crear Nuevo Turno</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                }}
            >
                <div>
                    <label>Día:</label>
                    <select
                        value={data.dia}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("dia", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="Lunes">Lunes</option>
                        <option value="Martes">Martes</option>
                        <option value="Miercoles">Miércoles</option>
                        <option value="Jueves">Jueves</option>
                        <option value="Viernes">Viernes</option>
                    </select>
                    {errors.dia && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.dia}
                        </div>
                    )}
                </div>

                <div>
                    <label>Hora (HH:MM):</label>
                    <input
                        type="time"
                        value={data.hora}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setData("hora", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    />
                    {errors.hora && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.hora}
                        </div>
                    )}
                </div>

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
                    <label>Entrenador:</label>
                    <select
                        value={data.trainer_id}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setData("trainer_id", e.target.value)
                        }
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginTop: "5px",
                        }}
                    >
                        <option value="">-- Seleccionar Entrenador --</option>
                        {entrenadores.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.employee?.user
                                    ? t.employee.user.name
                                    : `Entrenador #${t.id}`}
                            </option>
                        ))}
                    </select>
                    {errors.trainer_id && (
                        <div style={{ color: "red", fontSize: "13px" }}>
                            {errors.trainer_id}
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
                        Guardar Turno
                    </button>
                    <Link href="/turnos">Cancelar</Link>
                </div>
            </form>
        </div>
    );
}
