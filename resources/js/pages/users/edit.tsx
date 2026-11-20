import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    AlertTriangle,
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

interface UserItem {
    id: number;
    name: string;
    email: string;
}

interface EditProps {
    user: UserItem;
    roles: Role[];
    userRoles: string[]; // Nombres de los roles que ya posee el usuario
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

export default function Edit({ user, roles, userRoles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "", // En blanco por seguridad
        roles: userRoles,
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
        put(`/users/${user.id}`);
    };

    const inputClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title={`Editar Usuario: ${user.name}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Editar Usuario
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Actualizá los datos de acceso o roles de{" "}
                                <span className="font-medium text-gray-700">
                                    {user.name}
                                </span>
                                .
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
                                        className={inputClass}
                                        placeholder="juan.perez@email.com"
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
                                        className={inputClass}
                                        placeholder="Ingrese nueva contraseña..."
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1.5">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                                    <label className="block text-base font-medium text-gray-700">
                                        Roles Asignados
                                    </label>
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
                                    {errors.roles && (
                                        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-center gap-2 border border-red-200 mt-1.5">
                                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                                            <span>{errors.roles}</span>
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
                                        : "Actualizar Usuario"}
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
