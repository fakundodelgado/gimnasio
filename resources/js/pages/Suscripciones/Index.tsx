import React, { useState, FormEvent } from "react";
import { Link, router } from "@inertiajs/react";
import { SelectBuscador } from "@/components/SelectBuscador";

interface User {
    id: number;
    name: string;
    email?: string;
}

interface Client {
    id: number;
    telefono?: string;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    precio: number | string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
    deleted_at: string | null;
    client?: Client;
    plan?: Plan;
}

interface SuscripcionesPaginadas {
    data: Subscription[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Filtros {
    datos: string;
    id: string;
    orden: string;
    papelera: string;
    direccion: string;
    paginas: number;
    desde: string;
    hasta: string;
    plan: string;
    estado: string;
}

interface IndexProps {
    suscripciones: SuscripcionesPaginadas;
    planes: Plan[];
    filtros: Filtros;
    esAdmin: boolean;
    esCliente: boolean;
}

export default function Index({
    suscripciones,
    planes,
    filtros,
    esAdmin,
    esCliente,
}: IndexProps) {
    const [datos, setDatos] = useState(filtros.datos ?? "");
    const [id, setId] = useState(filtros.id ?? "");
    const [plan, setPlan] = useState(filtros.plan ?? "");
    const [estado, setEstado] = useState(filtros.estado ?? "");
    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "fecha_inicio");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const opcionesPlanes = planes.map((p) => ({
        id: String(p.id),
        label: `#${p.id} - ${p.nombre}`,
    }));

    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/suscripciones",
            {
                datos,
                id,
                plan,
                estado,
                desde,
                hasta,
                orden,
                direccion,
                paginas,
                papelera,
                ...overrides,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const aplicarFiltros = (e: FormEvent) => {
        e.preventDefault();
        enviarConsulta();
    };

    const limpiarFiltros = () => {
        setDatos("");
        setId("");
        setPlan("");
        setEstado("");
        setDesde("");
        setHasta("");
        setOrden("fecha_inicio");
        setDireccion("desc");
        setPaginas(5);
        setPapelera("sin_eliminados");

        router.get("/suscripciones");
    };

    const ordenarPor = (campo: string) => {
        let nuevaDireccion = "asc";
        if (orden === campo && direccion === "asc") {
            nuevaDireccion = "desc";
        }
        setOrden(campo);
        setDireccion(nuevaDireccion);

        enviarConsulta({
            orden: campo,
            direccion: nuevaDireccion,
        });
    };

    const indicadorOrden = (campo: string) => {
        if (orden !== campo) return "";
        return direccion === "asc" ? " ↑" : " ↓";
    };

    const handleDelete = (subId: number) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta suscripción?")) {
            router.delete(`/suscripciones/${subId}`);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Listado de Suscripciones</h2>

            {!esCliente && (
                <Link
                    href="/suscripciones/create"
                    style={{
                        display: "inline-block",
                        marginBottom: "15px",
                        padding: "8px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: "4px",
                        textDecoration: "none",
                    }}
                >
                    + Nueva Suscripción
                </Link>
            )}

            {/* Formulario de Búsqueda y Filtros */}
            <form
                onSubmit={aplicarFiltros}
                style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "20px",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {!esCliente && (
                    <input
                        type="text"
                        value={datos}
                        onChange={(e) => setDatos(e.target.value)}
                        placeholder="Cliente: nombre, email o teléfono..."
                        style={{ padding: "6px 10px", minWidth: "240px" }}
                    />
                )}

                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="N° Suscripción (ID)..."
                    style={{ padding: "6px 10px", width: "165px" }}
                />

                <div style={{ minWidth: "220px" }}>
                    <SelectBuscador
                        options={opcionesPlanes}
                        value={plan}
                        onChange={(val) => setPlan(String(val))}
                        placeholder="Todos los planes..."
                    />
                </div>

                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">Todos los estados</option>
                    <option value="activa">Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="vencida">Vencida</option>
                    <option value="cancelada">Cancelada</option>
                </select>

                <label style={{ fontSize: "14px" }}>
                    Desde:
                    <input
                        type="date"
                        value={desde}
                        onChange={(e) => setDesde(e.target.value)}
                        style={{ marginLeft: "5px", padding: "5px 8px" }}
                    />
                </label>

                <label style={{ fontSize: "14px" }}>
                    Hasta:
                    <input
                        type="date"
                        value={hasta}
                        onChange={(e) => setHasta(e.target.value)}
                        style={{ marginLeft: "5px", padding: "5px 8px" }}
                    />
                </label>

                {esAdmin && (
                    <select
                        value={papelera}
                        onChange={(e) => setPapelera(e.target.value)}
                        style={{
                            padding: "6px 10px",
                            background: "#fffbeb",
                            borderColor: "#f59e0b",
                        }}
                    >
                        <option value="sin_eliminados">
                            Activos únicamente
                        </option>
                        <option value="solo_eliminados">Solo eliminados</option>
                        <option value="con_eliminados">
                            Todos (Activos y Eliminados)
                        </option>
                    </select>
                )}

                <label style={{ fontSize: "14px" }}>
                    Mostrar:
                    <select
                        value={paginas}
                        onChange={(e) => setPaginas(Number(e.target.value))}
                        style={{ marginLeft: "5px", padding: "6px" }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>

                <button
                    type="submit"
                    style={{ padding: "6px 12px", cursor: "pointer" }}
                >
                    Buscar
                </button>

                <button
                    type="button"
                    onClick={limpiarFiltros}
                    style={{ padding: "6px 12px", cursor: "pointer" }}
                >
                    Limpiar
                </button>
            </form>

            {/* Tabla */}
            <table
                border={1}
                cellPadding="10"
                cellSpacing="0"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th
                            onClick={() => ordenarPor("id")}
                            style={{ cursor: "pointer" }}
                        >
                            ID / Boleta{indicadorOrden("id")}
                        </th>
                        <th>Cliente</th>
                        {!esCliente && <th>Teléfono</th>}
                        {!esCliente && <th>Email</th>}
                        <th>Plan</th>
                        <th
                            onClick={() => ordenarPor("precio")}
                            style={{ cursor: "pointer" }}
                        >
                            Precio{indicadorOrden("precio")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_inicio")}
                            style={{ cursor: "pointer" }}
                        >
                            Inicio{indicadorOrden("fecha_inicio")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_fin")}
                            style={{ cursor: "pointer" }}
                        >
                            Fin{indicadorOrden("fecha_fin")}
                        </th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {suscripciones.data.length > 0 ? (
                        suscripciones.data.map((sub: Subscription) => (
                            <tr
                                key={sub.id}
                                style={{
                                    background: sub.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>#{sub.id}</td>
                                <td>
                                    {sub.client?.user?.name ||
                                        `Cliente #${sub.client_id}`}
                                </td>
                                {!esCliente && (
                                    <td>{sub.client?.telefono || "—"}</td>
                                )}
                                {!esCliente && (
                                    <td>{sub.client?.user?.email || "—"}</td>
                                )}
                                <td>
                                    {sub.plan?.nombre || `Plan #${sub.plan_id}`}
                                </td>
                                <td>
                                    $
                                    {Number(sub.precio).toLocaleString("es-AR")}
                                </td>
                                <td>{sub.fecha_inicio}</td>
                                <td>{sub.fecha_fin}</td>
                                <td>
                                    {sub.estado.toUpperCase()}
                                    {sub.deleted_at && (
                                        <span
                                            style={{
                                                color: "red",
                                                fontSize: "11px",
                                                display: "block",
                                            }}
                                        >
                                            (ELIMINADO)
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {sub.deleted_at ? (
                                        /* Si la suscripción está eliminada, mostramos el botón de Restaurar */
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        "¿Estás seguro de que deseas restaurar esta suscripción?",
                                                    )
                                                ) {
                                                    router.patch(
                                                        `/suscripciones/${sub.id}/restore`,
                                                    );
                                                }
                                            }}
                                            style={{
                                                color: "green",
                                                fontWeight: "bold",
                                                cursor: "pointer",
                                                background: "none",
                                                border: "none",
                                                padding: 0,
                                            }}
                                        >
                                            Restaurar
                                        </button>
                                    ) : (
                                        /* Si está activa, mostramos las acciones normales */
                                        <>
                                            <Link
                                                href={`/suscripciones/${sub.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>
                                            <Link
                                                href={`/suscripciones/${sub.id}/edit`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Editar
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(sub.id)
                                                }
                                                style={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={esCliente ? 8 : 10}
                                style={{ textAlign: "center" }}
                            >
                                No hay suscripciones registradas.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginador */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "15px",
                }}
            >
                <p style={{ fontSize: "14px" }}>
                    Mostrando {suscripciones.from ?? 0} a{" "}
                    {suscripciones.to ?? 0} de {suscripciones.total} resultados
                </p>
                <div>
                    {suscripciones.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    suscripciones.prev_page_url!,
                                    {},
                                    { preserveState: true },
                                )
                            }
                            style={{
                                marginRight: "10px",
                                padding: "6px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Anterior
                        </button>
                    )}
                    <span>
                        Página {suscripciones.current_page} de{" "}
                        {suscripciones.last_page}
                    </span>
                    {suscripciones.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    suscripciones.next_page_url!,
                                    {},
                                    { preserveState: true },
                                )
                            }
                            style={{
                                marginLeft: "10px",
                                padding: "6px 12px",
                                cursor: "pointer",
                            }}
                        >
                            Siguiente
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
