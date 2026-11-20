import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
}

interface EditProps {
    role: Role;
    permissions: Permission[];
    rolePermissions: string[];
}

export default function Edit({
    role,
    permissions,
    rolePermissions,
}: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: rolePermissions,
    });

    const handleCheckboxChange = (name: string, checked: boolean) => {
        if (checked) {
            setData("permissions", [...data.permissions, name]);
        } else {
            setData(
                "permissions",
                data.permissions.filter((p) => p !== name),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const inputClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    const checkboxAzulClass =
        "data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white";

    return (
        <>
            <Head title={`Editar Rol: ${role.name}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Rol
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Modificá el nombre o los permisos asignados a{" "}
                                <span className="font-medium text-gray-700">
                                    {role.name}
                                </span>
                                .
                            </p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full sm:w-auto shrink-0 bg-white"
                        >
                            <Link href="/roles">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al listado
                            </Link>
                        </Button>
                    </div>

                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <form onSubmit={handleSubmit}>
                            <CardContent className="p-6 space-y-5 bg-white">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="name"
                                        className="block text-base font-medium text-gray-700"
                                    >
                                        Nombre del Rol
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className={inputClass}
                                        placeholder="Ej. Administrador"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <label className="block text-base font-medium text-gray-700">
                                        Modificar Permisos
                                    </label>
                                    {permissions.length === 0 ? (
                                        <p className="text-sm italic text-gray-500">
                                            No hay permisos disponibles en el
                                            sistema.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-md border border-gray-200 bg-gray-50/80">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    htmlFor={`perm-${permission.id}`}
                                                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 cursor-pointer select-none hover:bg-gray-50"
                                                >
                                                    <Checkbox
                                                        id={`perm-${permission.id}`}
                                                        checked={data.permissions.includes(
                                                            permission.name,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) =>
                                                            handleCheckboxChange(
                                                                permission.name,
                                                                !!checked,
                                                            )
                                                        }
                                                        className={
                                                            checkboxAzulClass
                                                        }
                                                    />
                                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                    <span className="truncate">
                                                        {permission.name}
                                                    </span>
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
                                        ? "Actualizando..."
                                        : "Actualizar Rol"}
                                </Button>
                                <Button
                                    asChild
                                    className="w-full sm:w-auto bg-white"
                                    variant="outline"
                                >
                                    <Link href="/roles">Cancelar</Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}
