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
import { ConfirmDeleteDialog } from "@/components/confirmar-eliminacion";
import {
    Briefcase,
    DollarSign,
    Dumbbell,
    Eye,
    KeyRound,
    Pencil,
    Plus,
    Shield,
    Trash2,
    UserCheck,
} from "lucide-react";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[]; // Roles asignados mediante Spatie
}

interface IndexProps {
    users: User[];
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

export default function Index({ users }: IndexProps) {
    const [searchQuery, setSearchQuery] = useState("");

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
        router.delete(`/users/${idSeleccionado}`, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    // Filtrado interactivo por Nombre, Email o Roles asignados
    const filteredUsers = users.filter((user) => {
        const matchesName = user.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesEmail = user.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesRole = user.roles.some((role) =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        return matchesName || matchesEmail || matchesRole;
    });

    return (
        <>
            <Head title="Usuarios y Roles" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-5">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Usuarios y Roles
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Administrá las cuentas de usuario y sus niveles
                                de acceso globales.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="w-full sm:w-auto shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            <Link href="/users/create">
                                <Plus className="w-4 h-4 mr-2" />
                                Registrar Usuario
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-indigo-200 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-950">
                        <span>
                            Este crud gestiona únicamente cuentas
                            administrativas (<strong>Super Admin</strong> y{" "}
                            <strong>Admin</strong>). Para otros perfiles:
                        </span>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <Link
                                href="/clientes"
                                className="rounded-md bg-white px-3 py-1.5 font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-200 hover:bg-indigo-100 transition"
                            >
                                Clientes
                            </Link>
                            <Link
                                href="/empleados"
                                className="rounded-md bg-white px-3 py-1.5 font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-200 hover:bg-indigo-100 transition"
                            >
                                Empleados
                            </Link>
                            <Link
                                href="/entrenadores"
                                className="rounded-md bg-white px-3 py-1.5 font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-200 hover:bg-indigo-100 transition"
                            >
                                Entrenadores
                            </Link>
                        </div>
                    </div>

                    {/* Buscador de punta a punta */}
                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Tabla de Usuarios */}
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
                                                Nombre / Email
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                Roles Asignados
                                            </TableHead>
                                            <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                Acciones
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                                >
                                                    No se encontraron usuarios
                                                    que coincidan con los
                                                    criterios.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="hover:bg-gray-50/70"
                                                >
                                                    <TableCell className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                                        #{user.id}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="font-semibold text-gray-900">
                                                                {user.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center whitespace-nowrap">
                                                        <div className="inline-flex flex-wrap items-center justify-center gap-1.5">
                                                            {user.roles
                                                                .length ===
                                                            0 ? (
                                                                <span className="text-xs italic text-gray-400">
                                                                    Sin roles
                                                                    asignados
                                                                </span>
                                                            ) : (
                                                                user.roles.map(
                                                                    (role) => (
                                                                        <Badge
                                                                            key={
                                                                                role.id
                                                                            }
                                                                            variant="outline"
                                                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 border-indigo-200 capitalize"
                                                                        >
                                                                            {renderRolIcono(
                                                                                role.name,
                                                                            )}
                                                                            {
                                                                                role.name
                                                                            }
                                                                        </Badge>
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
                                                                    href={`/users/${user.id}`}
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
                                                                    href={`/users/${user.id}/edit`}
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
                                                                        user.id,
                                                                    )
                                                                }
                                                                className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                                                                title="Eliminar usuario"
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
                                    {filteredUsers.length}
                                </span>{" "}
                                de{" "}
                                <span className="font-semibold text-gray-900">
                                    {users.length}
                                </span>{" "}
                                usuarios
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN CON SHADCN/UI */}
            <ConfirmDeleteDialog
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onConfirm={ejecutarEliminacion}
                isDeleting={isDeleting}
                title="¿Eliminar usuario?"
                itemLabel={users.find((u) => u.id === idSeleccionado)?.name}
                description="¿Desea continuar?"
                confirmText="Sí, eliminar usuario"
            />
        </>
    );
}
