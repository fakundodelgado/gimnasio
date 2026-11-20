import React, { useState, FormEvent } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Plus,
    ChevronDown,
    Search,
    RotateCcw,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

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

    const inputBaseClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const selectBaseClass =
        "w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Historial de Accesos" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Historial de Accesos
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Registro histórico de marcaciones e ingresos al
                                gimnasio.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Link href="/ingresos/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Terminal de Marcación
                            </Link>
                        </Button>
                    </div>

                    {/* Filtros */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white mb-6">
                        <CardContent className="p-4 sm:p-5 bg-white">
                            <form
                                onSubmit={aplicarFiltros}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cliente / Socio
                                        </label>
                                        <input
                                            type="text"
                                            value={cliente}
                                            onChange={(e) =>
                                                setCliente(e.target.value)
                                            }
                                            placeholder="Nombre o ID de cliente..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Registrado por
                                        </label>
                                        <input
                                            type="text"
                                            value={empleado}
                                            onChange={(e) =>
                                                setEmpleado(e.target.value)
                                            }
                                            placeholder="Nombre o ID de empleado..."
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Mostrar
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={paginas}
                                                onChange={(e) =>
                                                    setPaginas(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className={selectBaseClass}
                                            >
                                                <option value={5}>
                                                    5 por página
                                                </option>
                                                <option value={10}>
                                                    10 por página
                                                </option>
                                                <option value={25}>
                                                    25 por página
                                                </option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={desde}
                                            onChange={(e) =>
                                                setDesde(e.target.value)
                                            }
                                            className={inputBaseClass}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={hasta}
                                            onChange={(e) =>
                                                setHasta(e.target.value)
                                            }
                                            className={inputBaseClass}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-2.5 pt-2 border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        <Search className="w-4 h-4 mr-2" />
                                        Filtrar
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={limpiarFiltros}
                                        className="w-full sm:w-auto bg-white"
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Limpiar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Tabla */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardContent className="p-0 bg-white">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                # ID
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Cliente / Socio
                                            </th>
                                            <th
                                                onClick={alternarOrdenFecha}
                                                className="px-6 py-3.5 text-center cursor-pointer select-none hover:text-gray-900 whitespace-nowrap"
                                            >
                                                <span className="inline-flex items-center justify-center">
                                                    Fecha y Hora
                                                    {direccion === "asc" ? (
                                                        <ArrowUp className="w-3.5 h-3.5 inline-block ml-1 text-indigo-600" />
                                                    ) : (
                                                        <ArrowDown className="w-3.5 h-3.5 inline-block ml-1 text-indigo-600" />
                                                    )}
                                                </span>
                                            </th>
                                            <th className="px-6 py-3.5 text-center whitespace-nowrap">
                                                Registrado Por
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {ingresos.data &&
                                        ingresos.data.length > 0 ? (
                                            ingresos.data.map((ingreso) => {
                                                const fechaMostrar =
                                                    ingreso.fecha_hora ||
                                                    ingreso.created_at;

                                                return (
                                                    <tr
                                                        key={ingreso.id}
                                                        className="hover:bg-gray-50/70"
                                                    >
                                                        <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                            #{ingreso.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="inline-flex items-center justify-center gap-1.5">
                                                                <span className="font-medium text-gray-900">
                                                                    {ingreso
                                                                        .client
                                                                        ?.user
                                                                        ?.name ||
                                                                        `Cliente #${ingreso.client_id}`}
                                                                </span>
                                                                {ingreso.client
                                                                    ?.deleted_at && (
                                                                    <span className="text-xs font-semibold text-red-600">
                                                                        (Baja)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            {new Date(
                                                                fechaMostrar,
                                                            ).toLocaleString(
                                                                "es-AR",
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                                            <div className="inline-flex items-center justify-center gap-1.5">
                                                                <span>
                                                                    {ingreso
                                                                        .employee
                                                                        ?.user
                                                                        ?.name ||
                                                                        "Totem / Sistema"}
                                                                </span>
                                                                {ingreso
                                                                    .employee
                                                                    ?.deleted_at && (
                                                                    <span className="text-xs font-semibold text-red-600">
                                                                        (Baja)
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No hay registros de ingresos
                                                    con los filtros actuales.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Mostrando{" "}
                                <span className="font-semibold text-gray-900">
                                    {ingresos.from ?? 0}
                                </span>{" "}
                                a{" "}
                                <span className="font-semibold text-gray-900">
                                    {ingresos.to ?? 0}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {ingresos.total}
                                </span>{" "}
                                resultados
                            </p>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                {ingresos.prev_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                ingresos.prev_page_url!,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        Anterior
                                    </Button>
                                )}

                                <span className="text-sm text-gray-700 whitespace-nowrap">
                                    Página{" "}
                                    <span className="font-semibold text-gray-900">
                                        {ingresos.current_page}
                                    </span>{" "}
                                    de{" "}
                                    <span className="font-semibold text-gray-900">
                                        {ingresos.last_page}
                                    </span>
                                </span>

                                {ingresos.next_page_url && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="bg-white"
                                        onClick={() =>
                                            router.get(
                                                ingresos.next_page_url!,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
