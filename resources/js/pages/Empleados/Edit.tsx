import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Employee {
    id: number;
    cuil: string;
    telefono: string;
    user: User;
}

interface EditProps {
    empleado: Employee;
}

export default function Edit({ empleado }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: empleado.user?.name || "",
        email: empleado.user?.email || "",
        password: "",
        cuil: empleado.cuil || "",
        telefono: empleado.telefono || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/empleados/${empleado.id}`);
    };

    return (
        <>
            <Head title={`Editar Empleado: ${empleado.user?.name || ""}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Empleado
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Modificá los datos personales, CUIL o contacto
                                de{" "}
                                <span className="font-medium text-gray-700">
                                    {empleado.user?.name ||
                                        `Empleado #${empleado.id}`}
                                </span>
                                .
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/empleados">
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
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Ej. María González"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="maria.gonzalez@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-base font-medium text-gray-700">
                                        Contraseña (Opcional)
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="Ingrese nueva contraseña..."
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            CUIL (11 dígitos)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.cuil}
                                            onChange={(e) =>
                                                setData("cuil", e.target.value)
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Ej. 20345678901"
                                        />
                                        {errors.cuil && (
                                            <p className="text-sm text-red-600 mt-1.5">
                                                {errors.cuil}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="text"
                                            value={data.telefono}
                                            onChange={(e) =>
                                                setData(
                                                    "telefono",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            placeholder="Ej. 3874123456"
                                        />
                                        {errors.telefono && (
                                            <p className="text-sm text-red-600 mt-1.5">
                                                {errors.telefono}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                                <Button
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Actualizando..."
                                        : "Actualizar Empleado"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/empleados">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
