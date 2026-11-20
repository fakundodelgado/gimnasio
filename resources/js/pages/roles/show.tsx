import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Pencil, ShieldCheck, Tag } from "lucide-react";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export default function Show({ role }: { role: Role }) {
    return (
        <>
            <Head title={`Rol: ${role.name}`} />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Detalles del Rol
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Información del rol y accesos habilitados en el
                                sistema.
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

                    {/* Tarjeta Principal */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b border-gray-100 pb-4">
                            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                Rol #{role.id}
                            </span>
                            <CardTitle className="text-xl font-bold text-gray-900 mt-0.5">
                                {role.name}
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Detalle de permisos asociados a este rol.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-6 space-y-5 bg-white">
                            <div className="bg-gray-50/80 border border-gray-100 p-4 rounded-xl flex flex-col justify-between">
                                <div className="flex items-center gap-2 text-gray-500 mb-1">
                                    <Tag className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">
                                        Nombre Interno
                                    </span>
                                </div>
                                <p className="text-base font-bold text-gray-900 capitalize">
                                    {role.name}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                                    Permisos Habilitados (
                                    {role.permissions.length})
                                </span>
                                {role.permissions.length === 0 ? (
                                    <p className="text-sm italic text-gray-400">
                                        Este rol no cuenta con ningún permiso
                                        asignado.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/80">
                                        {role.permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-md bg-white border border-gray-200 text-gray-700 truncate"
                                                title={permission.name}
                                            >
                                                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                                <span className="truncate">
                                                    {permission.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                            <Button
                                asChild
                                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                <Link href={`/roles/${role.id}/edit`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Ir a Editar
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </>
    );
}
