import React, { useState, FormEvent } from "react";
import { Head, Link, router } from "@inertiajs/react";

interface User {
    name: string;
    deleted_at?: string | null;
}

interface Client {
    id: number;
    deleted_at?: string | null;
    user?: User;
}

interface Employee {
    id: number;
    deleted_at?: string | null;
    user?: User;
}

interface Ingreso {
    id: number;
    client_id: number;
    fecha_hora?: string;
    created_at: string;
    client?: Client;
    employee?: Employee;
}

interface IngresosPaginados {
    data: Ingreso[];
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
    cliente: string;
    empleado: string;
    desde: string;
    hasta: string;
    direccion: string;
    paginas: number;
}

interface IndexProps {
    ingresos: IngresosPaginados;
    filtros: Filtros;
}

export default function Index({ ingresos, filtros }: IndexProps) {
    const [cliente, setCliente] = useState(filtros.cliente ?? "");
    const [empleado, setEmpleado] = useState(filtros.empleado ?? "");
    const [desde, setDesde] = useState(filtros.desde ?? "");
    const [hasta, setHasta] = useState(filtros.hasta ?? "");
    const [direccion, setDireccion] = useState(filtros.direccion ?? "desc");
    const [paginas, setPaginas] = useState(filtros.paginas ?? 5);

    const enviarConsulta = (
        overrides: Record<string, string | number> = {},
    ) => {
        router.get(
            "/ingresos",
            {
                cliente,
                empleado,
                desde,
                hasta,
                direccion,
                paginas,
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
        setCliente("");
        setEmpleado("");
        setDesde("");
        setHasta("");
        setDireccion("desc");
        setPaginas(5);

        router.get("/ingresos");
    };

    const alternarOrdenFecha = () => {
        const nuevaDireccion = direccion === "desc" ? "asc" : "desc";
        setDireccion(nuevaDireccion);
        enviarConsulta({ direccion: nuevaDireccion });
    };

    return (
        <>
            <Head title="Historial de Accesos" />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Historial de Accesos
                        </h1>
                        <p className="text-sm text-gray-500">
                            Registro histórico de marcaciones e ingresos al
                            gimnasio
                        </p>
                    </div>

                    <Link
                        href="/ingresos/create"
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
                    >
                        + Terminal de Marcación
                    </Link>
                </div>

                {/* Formulario de Búsqueda y Filtros */}
                <form
                    onSubmit={aplicarFiltros}
                    className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-end"
                >
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                            Cliente / Socio
                        </label>
                        <input
                            type="text"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            placeholder="Nombre o ID de cliente..."
                            className="border rounded px-3 py-1.5 text-sm min-w-[200px]"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                            Registrado por
                        </label>
                        <input
                            type="text"
                            value={empleado}
                            onChange={(e) => setEmpleado(e.target.value)}
                            placeholder="Nombre o ID de empleado..."
                            className="border rounded px-3 py-1.5 text-sm min-w-[200px]"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            value={desde}
                            onChange={(e) => setDesde(e.target.value)}
                            className="border rounded px-3 py-1.5 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            value={hasta}
                            onChange={(e) => setHasta(e.target.value)}
                            className="border rounded px-3 py-1.5 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">
                            Mostrar
                        </label>
                        <select
                            value={paginas}
                            onChange={(e) => setPaginas(Number(e.target.value))}
                            className="border rounded px-3 py-1.5 text-sm"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition cursor-pointer"
                        >
                            Filtrar
                        </button>

                        <button
                            type="button"
                            onClick={limpiarFiltros}
                            className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 transition cursor-pointer"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>

                {/* Tabla */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b text-sm font-semibold text-gray-700">
                                <th className="p-3"># ID</th>
                                <th className="p-3">Cliente / Socio</th>
                                <th
                                    onClick={alternarOrdenFecha}
                                    className="p-3 cursor-pointer select-none hover:bg-gray-200 transition"
                                >
                                    Fecha y Hora{" "}
                                    {direccion === "asc" ? "↑" : "↓"}
                                </th>
                                <th className="p-3">Registrado Por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ingresos.data && ingresos.data.length > 0 ? (
                                ingresos.data.map((ingreso) => {
                                    const fechaMostrar =
                                        ingreso.fecha_hora ||
                                        ingreso.created_at;

                                    return (
                                        <tr
                                            key={ingreso.id}
                                            className="border-b hover:bg-gray-50 text-sm"
                                        >
                                            <td className="p-3 font-semibold text-gray-700">
                                                #{ingreso.id}
                                            </td>
                                            <td className="p-3 font-medium text-gray-900">
                                                {ingreso.client?.user?.name ||
                                                    `Cliente #${ingreso.client_id}`}
                                                {ingreso.client?.deleted_at && (
                                                    <span className="ml-2 text-xs text-red-600 font-normal">
                                                        (Baja)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {new Date(
                                                    fechaMostrar,
                                                ).toLocaleString("es-AR")}
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                {ingreso.employee?.user?.name ||
                                                    "Totem / Sistema"}
                                                {ingreso.employee
                                                    ?.deleted_at && (
                                                    <span className="ml-2 text-xs text-red-600">
                                                        (Baja)
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No hay registros de ingresos con los
                                        filtros actuales.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginador */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <p>
                        Mostrando {ingresos.from ?? 0} a {ingresos.to ?? 0} de{" "}
                        {ingresos.total} resultados
                    </p>
                    <div className="flex items-center gap-2">
                        {ingresos.prev_page_url && (
                            <button
                                onClick={() =>
                                    router.get(
                                        ingresos.prev_page_url!,
                                        {},
                                        { preserveState: true },
                                    )
                                }
                                className="px-3 py-1.5 bg-white border rounded hover:bg-gray-100 cursor-pointer"
                            >
                                Anterior
                            </button>
                        )}
                        <span>
                            Página {ingresos.current_page} de{" "}
                            {ingresos.last_page}
                        </span>
                        {ingresos.next_page_url && (
                            <button
                                onClick={() =>
                                    router.get(
                                        ingresos.next_page_url!,
                                        {},
                                        { preserveState: true },
                                    )
                                }
                                className="px-3 py-1.5 bg-white border rounded hover:bg-gray-100 cursor-pointer"
                            >
                                Siguiente
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
