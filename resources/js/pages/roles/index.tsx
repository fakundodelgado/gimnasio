import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    AlertTriangle,
    Briefcase,
    DollarSign,
    Dumbbell,
    Eye,
    KeyRound,
    Loader2,
    Pencil,
    Plus,
    Shield,
    Trash2,
    UserCheck,
} from "lucide-react";

interface Permission {
    id: number;
    name: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

const renderRolIcono = (roleName: string) => {
    const normalizado = roleName.toLowerCase();

    if (normalizado.includes("super")) {
        return <Shield className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }
    if (normalizado.includes("admin")) {
        return <KeyRound className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }
    if (normalizado.includes("entrenador") || normalizado.includes("trainer")) {
        return <Dumbbell className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }
    if (normalizado.includes("cliente") || normalizado.includes("client")) {
        return <DollarSign className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }
    if (normalizado.includes("empleado") || normalizado.includes("employee")) {
        return <Briefcase className="w-3.5 h-3.5 mr-1 shrink-0" />;
    }

    return <UserCheck className="w-3.5 h-3.5 mr-1 shrink-0" />;
};

export default function Index({ roles }: { roles: Role[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    // Estados para el Modal de Confirmación
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        setIdSeleccionado(id);
        setIsModalOpen(true);
    };

    const ejecutarEliminacion = () => {
        if (!idSeleccionado) return;
        setIsDeleting(true);
        router.delete(`/roles/${idSeleccionado}`, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    // Filtrado interactivo en tiempo real por nombre del rol o permisos
    const filteredRoles = roles.filter((role) => {
        const matchesRoleName = role.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesPermission = role.permissions.some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return matchesRoleName || matchesPermission;
    });

    return (
        <>
            <Head title="Roles" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto space-y-5">
                    {/* Encabezado Principal */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Roles
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Gestión y listado de los roles y permisos del
                                sistema.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Link href="/roles/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo rol
                            </Link>
                        </Button>
                    </div>

                    {/* Buscador de punta a punta */}
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Buscar por rol o permiso..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Tabla de Datos */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                        <CardContent className="p-0 bg-white">
                            <div className="overflow-x-auto">
                                <Table className="w-full border-collapse">
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/80 border-b border-gray-200">
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                ID
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                Nombre del Rol
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                Permisos Asignados
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                Acciones
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {filteredRoles.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No se encontraron roles que
                                                    coincidan con la búsqueda.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredRoles.map((role) => (
                                                <TableRow
                                                    key={role.id}
                                                    className="hover:bg-gray-50/70"
                                                >
                                                    <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        #{role.id}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        <Badge
                                                            variant="outline"
                                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 border-indigo-200 capitalize font-semibold px-2.5 py-1"
                                                        >
                                                            {renderRolIcono(
                                                                role.name,
                                                            )}
                                                            <span>
                                                                {role.name}
                                                            </span>
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center">
                                                        <div className="inline-flex flex-wrap items-center justify-center gap-1 max-w-xl">
                                                            {role.permissions
                                                                .length ===
                                                            0 ? (
                                                                <span className="text-xs italic text-gray-400">
                                                                    Sin permisos
                                                                    asignados
                                                                </span>
                                                            ) : (
                                                                role.permissions.map(
                                                                    (p) => (
                                                                        <span
                                                                            key={
                                                                                p.id
                                                                            }
                                                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                                                        >
                                                                            {
                                                                                p.name
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="inline-flex items-center justify-center gap-1.5">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-gray-700 hover:text-gray-900"
                                                                title="Ver detalles del rol"
                                                            >
                                                                <Link
                                                                    href={`/roles/${role.id}`}
                                                                >
                                                                    <Eye className="w-4 h-4 mr-1.5" />
                                                                    Ver
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                                                title="Editar rol"
                                                            >
                                                                <Link
                                                                    href={`/roles/${role.id}/edit`}
                                                                >
                                                                    <Pencil className="w-4 h-4 mr-1.5" />
                                                                    Editar
                                                                </Link>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        role.id,
                                                                    )
                                                                }
                                                                className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                                                                title="Eliminar rol"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-1.5" />
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-3.5 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Mostrando{" "}
                                <span className="font-semibold text-gray-900">
                                    {filteredRoles.length}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {roles.length}
                                </span>{" "}
                                roles
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN CON SHADCN/UI */}
            <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogContent className="sm:max-w-106.25 bg-white border-gray-200">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-50 text-red-600 rounded-full">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <AlertDialogTitle className="text-xl text-gray-900">
                                ¿Eliminar rol?
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Estás a punto de borrar este rol permanentemente.
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            onClick={() => setIsModalOpen(false)}
                            className="bg-white"
                        >
                            Volver
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting}
                            onClick={(e) => {
                                e.preventDefault();
                                ejecutarEliminacion();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors duration-200"
                        >
                            {isDeleting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Eliminando...</span>
                                </div>
                            ) : (
                                "Sí, eliminar rol"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
