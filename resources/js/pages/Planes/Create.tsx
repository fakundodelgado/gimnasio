import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: 30,
        incluye_entrenador: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/planes");
    };

    return (
        <>
            <Head title="Crear Plan" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Crear Nuevo Plan
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Configurá el nombre, precio, duración y reglas
                                del plan.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/planes">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-5 bg-white">
                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Nombre del Plan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData("nombre", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Ej. Musculación Pase Libre"
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Descripción (Opcional)
                                    </label>
                                    <textarea
                                        value={data.descripcion}
                                        onChange={(e) =>
                                            setData(
                                                "descripcion",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder="Detalles sobre lo que incluye este plan..."
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.descripcion}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Precio ($)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.precio}
                                            onChange={(e) =>
                                                setData(
                                                    "precio",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="25000"
                                        />
                                        {errors.precio && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.precio}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Duración (Días)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.duracion}
                                            onChange={(e) =>
                                                setData(
                                                    "duracion",
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="30"
                                        />
                                        {errors.duracion && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.duracion}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Campo de Regla de Negocio: incluye_entrenador */}
                                <div className="pt-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.incluye_entrenador}
                                            onChange={(e) =>
                                                setData(
                                                    "incluye_entrenador",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-base font-medium text-gray-700">
                                            ¿Este plan incluye asignación de
                                            Entrenador Personal?
                                        </span>
                                    </label>
                                    {errors.incluye_entrenador && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.incluye_entrenador}
                                        </p>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Guardando..."
                                        : "Guardar Plan"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/planes">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
