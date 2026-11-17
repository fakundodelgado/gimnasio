import React, { useState, FormEvent } from "react";
import { Link, router } from "@inertiajs/react";

interface User {
    id: number;
    name: string;
    email: string;
    deleted_at?: string | null;
}

interface Client {
    id: number;
    user_id: number;
    telefono?: string;
    deleted_at?: string | null;
    user?: User;
}

interface Plan {
    id: number;
    nombre: string;
    precio: number;
}

interface Subscription {
    id: number;
    client_id: number;
    plan_id: number;
    client?: Client;
    plan?: Plan;
}

interface Employee {
    id: number;
    user_id: number;
    cuil?: string;
    deleted_at?: string | null;
    user?: User;
}

interface Payment {
    id: number;
    subscription_id: number;
    employee_id?: number;
    monto: number;
    fecha_pago: string;
    metodo_pago: string;
    deleted_at: string | null;
    subscription?: Subscription;
    employee?: Employee;
}

interface PagosPaginados {
    data: Payment[];
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
    empleado: string;
    id: string;
    suscripcion: string;
    metodo: string;
    desde: string;
    hasta: string;
    orden: string;
    papelera: string;
    direccion: string;
    paginas: number;
}

interface IndexProps {
    pagos: PagosPaginados;
    filtros: Filtros;
    esAdmin: boolean;
    esCliente: boolean;
}

export default function Index({
    pagos,
    filtros,
    esAdmin,
    esCliente,
}: IndexProps) {
    const [datos, setDatos] = useState(filtros.datos ?? "");
    const [empleado, setEmpleado] = useState(filtros.empleado ?? "");
    const [id, setId] = useState(filtros.id ?? "");
    const [suscripcion, setSuscripcion] = useState(filtros.suscripcion ?? "");
    const [metodo, setMetodo] = useState(filtros.metodo ?? "");
    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [orden, setOrden] = useState(filtros.orden ?? "fecha_pago");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);
    const [papelera, setPapelera] = useState(
        filtros.papelera ?? "sin_eliminados",
    );

    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/pagos",
            {
                datos,
                empleado,
                id,
                suscripcion,
                metodo,
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
        setEmpleado("");
        setId("");
        setSuscripcion("");
        setMetodo("");
        setDesde("");
        setHasta("");
        setOrden("fecha_pago");
        setDireccion("desc");
        setPaginas(5);
        setPapelera("sin_eliminados");

        router.get("/pagos");
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

    const handleDelete = (pagoId: number) => {
        if (confirm("¿Estás seguro de que deseas anular/eliminar este pago?")) {
            router.delete(`/pagos/${pagoId}`);
        }
    };

    // Query string exacta para que PDF y Excel apliquen los mismos filtros
    const queryExportacion = new URLSearchParams({
        datos,
        empleado,
        id,
        suscripcion,
        metodo,
        desde,
        hasta,
        orden,
        direccion,
        papelera,
    }).toString();

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h2>Historial de Pagos y Caja</h2>

            {!esCliente && (
                <Link
                    href="/pagos/create"
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
                    + Registrar Nuevo Pago
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
                        style={{ padding: "6px 10px", minWidth: "230px" }}
                    />
                )}

                {esAdmin && (
                    <input
                        type="text"
                        value={empleado}
                        onChange={(e) => setEmpleado(e.target.value)}
                        placeholder="Empleado: nombre o CUIL..."
                        style={{ padding: "6px 10px", minWidth: "200px" }}
                    />
                )}

                <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="N° Pago (ID)..."
                    style={{ padding: "6px 10px", width: "130px" }}
                />

                <input
                    type="text"
                    value={suscripcion}
                    onChange={(e) => setSuscripcion(e.target.value)}
                    placeholder="N° Suscripción..."
                    style={{ padding: "6px 10px", width: "140px" }}
                />

                <select
                    value={metodo}
                    onChange={(e) => setMetodo(e.target.value)}
                    style={{ padding: "6px 10px" }}
                >
                    <option value="">Todos los métodos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
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
                        <option value="sin_eliminados">No eliminados</option>
                        <option value="solo_eliminados">
                            Solo eliminados (Papelera)
                        </option>
                        <option value="con_eliminados">
                            Todos (Incl. eliminados)
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

                {esAdmin && (
                    <>
                        <a
                            href={`/pagos/pdf?${queryExportacion}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition inline-flex items-center gap-2"
                        >
                            Descargar PDF
                        </a>

                        <a
                            href={`/pagos/export?${queryExportacion}`}
                            className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 transition inline-flex items-center gap-2"
                        >
                            Descargar Excel
                        </a>
                    </>
                )}
            </form>

            {/* Tabla de Pagos */}
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
                            Comprobante #{indicadorOrden("id")}
                        </th>
                        <th>Cliente</th>
                        {!esCliente && <th>Teléfono</th>}
                        {!esCliente && <th>Email</th>}
                        <th>Plan</th>
                        <th
                            onClick={() => ordenarPor("monto")}
                            style={{ cursor: "pointer" }}
                        >
                            Monto{indicadorOrden("monto")}
                        </th>
                        <th
                            onClick={() => ordenarPor("metodo_pago")}
                            style={{ cursor: "pointer" }}
                        >
                            Método{indicadorOrden("metodo_pago")}
                        </th>
                        <th
                            onClick={() => ordenarPor("fecha_pago")}
                            style={{ cursor: "pointer" }}
                        >
                            Fecha{indicadorOrden("fecha_pago")}
                        </th>
                        {esAdmin && <th>Cobrado Por</th>}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.data.length > 0 ? (
                        pagos.data.map((pago: Payment) => (
                            <tr
                                key={pago.id}
                                style={{
                                    background: pago.deleted_at
                                        ? "#fef2f2"
                                        : "transparent",
                                }}
                            >
                                <td>
                                    #{pago.id} (Sub #{pago.subscription_id})
                                </td>
                                <td>
                                    {pago.subscription?.client?.user?.name ??
                                        "Cliente N/A"}
                                    {pago.subscription?.client?.deleted_at && (
                                        <span
                                            style={{
                                                color: "gray",
                                                fontSize: "11px",
                                                display: "block",
                                            }}
                                        >
                                            (Cliente Eliminado)
                                        </span>
                                    )}
                                </td>
                                {!esCliente && (
                                    <td>
                                        {pago.subscription?.client?.telefono ||
                                            "—"}
                                    </td>
                                )}
                                {!esCliente && (
                                    <td>
                                        {pago.subscription?.client?.user
                                            ?.email || "—"}
                                    </td>
                                )}
                                <td>
                                    {pago.subscription?.plan?.nombre ??
                                        "Plan N/A"}
                                </td>
                                <td>
                                    <strong>
                                        $
                                        {Number(pago.monto).toLocaleString(
                                            "es-AR",
                                        )}
                                    </strong>
                                </td>
                                <td>
                                    <span
                                        style={{ textTransform: "capitalize" }}
                                    >
                                        {pago.metodo_pago}
                                    </span>
                                </td>
                                <td>{pago.fecha_pago}</td>
                                {esAdmin && (
                                    <td>
                                        <div>
                                            {pago.employee?.user?.name ??
                                                "Sistema / Admin"}
                                        </div>
                                        {pago.employee?.cuil && (
                                            <div
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                }}
                                            >
                                                CUIL: {pago.employee.cuil}
                                            </div>
                                        )}
                                    </td>
                                )}
                                <td>
                                    {!pago.deleted_at ? (
                                        <>
                                            <Link
                                                href={`/pagos/${pago.id}`}
                                                style={{ marginRight: "8px" }}
                                            >
                                                Ver
                                            </Link>

                                            <Link
                                                href={`/pagos/${pago.id}/edit`}
                                                style={{
                                                    marginRight: "8px",
                                                }}
                                            >
                                                Editar
                                            </Link>

                                            {esAdmin && (
                                                <button
                                                    onClick={() =>
                                                        handleDelete(pago.id)
                                                    }
                                                    style={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Anular
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span
                                            style={{
                                                color: "red",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            ANULADO
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={esAdmin ? 10 : esCliente ? 7 : 9}
                                style={{ textAlign: "center" }}
                            >
                                No hay registros de pagos.
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
                    Mostrando {pagos.from ?? 0} a {pagos.to ?? 0} de{" "}
                    {pagos.total} resultados
                </p>
                <div>
                    {pagos.prev_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    pagos.prev_page_url!,
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
                        Página {pagos.current_page} de {pagos.last_page}
                    </span>
                    {pagos.next_page_url && (
                        <button
                            onClick={() =>
                                router.get(
                                    pagos.next_page_url!,
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
