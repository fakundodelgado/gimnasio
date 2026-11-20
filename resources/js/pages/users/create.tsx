import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    ArrowLeft,
    Briefcase,
    DollarSign,
    Dumbbell,
    KeyRound,
    Shield,
    UserCheck,
} from "lucide-react";

interface Role {
    id: number;
    name: string;
}

const renderRolIcono = (roleName: string) => {
    const normalizado = roleName.toLowerCase();

    if (normalizado.includes("super")) {
        return <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
    if (normalizado.includes("admin")) {
        return <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
    if (normalizado.includes("entrenador") || normalizado.includes("trainer")) {
        return <Dumbbell className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
    if (normalizado.includes("cliente") || normalizado.includes("client")) {
        return <DollarSign className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }
    if (normalizado.includes("empleado") || normalizado.includes("employee")) {
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    }

    return <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
};

export default function Create({ roles }: { roles: Role[] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: [] as string[],
    });

    const handleCheckboxChange = (roleName: string, checked: boolean) => {
        if (checked) {
            setData("roles", [...data.roles, roleName]);
        } else {
            setData(
                "roles",
                data.roles.filter((r) => r !== roleName),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/users");
    };

    const inputClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Crear Usuario" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Crear Nuevo Usuario
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Completá los datos para registrar un nuevo
                                usuario y asignar sus roles.
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/users">
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
                                        className={inputClass}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">
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
                                        className={inputClass}
                                        placeholder="juan.perez@email.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ingrese nueva contraseña..."
                                            className={inputClass}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-base font-medium text-gray-700">
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Repita la contraseña..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-base font-medium text-gray-700">
                                        Roles Asignados
                                    </label>
                                    {roles.length === 0 ? (
                                        <p className="text-sm italic text-gray-500">
                                            No hay roles creados en el sistema.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-md border border-gray-200 bg-gray-50/80">
                                            {roles.map((role) => (
                                                <label
                                                    key={role.id}
                                                    htmlFor={`role-${role.id}`}
                                                    className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 capitalize cursor-pointer select-none hover:bg-gray-50"
                                                >
                                                    <Checkbox
                                                        id={`role-${role.id}`}
                                                        checked={data.roles.includes(
                                                            role.name,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            handleCheckboxChange(
                                                                role.name,
                                                                !!checked,
                                                            )
                                                        }
                                                    />
                                                    {renderRolIcono(role.name)}
                                                    <span>{role.name}</span>
                                                </label>
                                            ))}
                                        </div>
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
                                        : "Guardar Usuario"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/users">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
