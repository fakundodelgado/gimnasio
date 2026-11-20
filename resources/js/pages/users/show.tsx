import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowLeft,
    Briefcase,
    DollarSign,
    Dumbbell,
    KeyRound,
    Mail,
    Pencil,
    Shield,
    ShieldCheck,
    User,
    UserCheck,
} from "lucide-react";

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

interface ShowProps {
    user: UserItem;
    permissions: Permission[];
}

const renderRolIcono = (roleName: string) => {
    const normalizado = roleName.toLowerCase();

    if (normalizado.includes("super")) {
        return <Shield className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    }
    if (normalizado.includes("admin")) {
        return <KeyRound className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    }
    if (normalizado.includes("entrenador") || normalizado.includes("trainer")) {
        return <Dumbbell className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    }
    if (normalizado.includes("cliente") || normalizado.includes("client")) {
        return <DollarSign className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    }
    if (normalizado.includes("empleado") || normalizado.includes("employee")) {
        return <Briefcase className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
    }

    return <UserCheck className="w-3.5 h-3.5 mr-1.5 shrink-0" />;
};

export default function Show({ user, permissions }: ShowProps) {
    return (
        <>
            <Head title={`Usuario: ${user.name}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalles del Usuario
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Identidad de la cuenta, roles asignados y
                                permisos efectivos del sistema.
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

                    {/* Tarjeta Principal */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                Usuario #{user.id}
                            </span>
                            <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                Ficha del Usuario
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Detalle de identidad y accesos de seguridad.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 space-y-5 bg-white">
                            {/* Cajas principales (mismo estilo que Clientes/Show) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Nombre Completo
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900">
                                        {user.name}
                                    </p>
                                </div>

                                <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between h-full">
                                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                                        <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                                        <span className="text-xs font-semibold uppercase tracking-wider">
                                            Dirección de Email
                                        </span>
                                    </div>
                                    <p className="text-base font-bold text-gray-900 break-all">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {/* Roles Asignados */}
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                                    Roles Asignados
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {user.roles.length === 0 ? (
                                        <p className="text-sm italic text-gray-400">
                                            Este usuario no posee roles
                                            asignados actualmente.
                                        </p>
                                    ) : (
                                        user.roles.map((role) => (
                                            <Badge
                                                key={role.id}
                                                variant="outline"
                                                className="inline-flex items-center bg-indigo-50 text-indigo-700 border-indigo-200 capitalize text-sm py-1 px-3 font-medium"
                                            >
                                                {renderRolIcono(role.name)}
                                                <span>{role.name}</span>
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Permisos Heredados compactos */}
                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                                    Capacidades de Sistema (Heredados de sus
                                    Roles)
                                </span>
                                {permissions.length === 0 ? (
                                    <p className="text-sm italic text-red-600">
                                        El usuario no tiene permisos efectivos.
                                        No podrá realizar acciones protegidas.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/80">
                                        {permissions.map((perm) => (
                                            <div
                                                key={perm.id}
                                                className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white border border-gray-200/80 text-gray-700 truncate"
                                                title={perm.name}
                                            >
                                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                <span className="truncate">
                                                    {perm.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {/* Pie de Tarjeta */}
                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                asChild
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href={`/users/${user.id}/edit`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Modificar Accesos
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
