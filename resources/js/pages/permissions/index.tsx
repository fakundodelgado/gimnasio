import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    Loader2,
    Pencil,
    Plus,
    Save,
    ShieldCheck,
    Trash2,
    X,
} from "lucide-react";

interface Permission {
    id: number;
    name: string;
    created_at: string;
}

interface IndexProps {
    permissions: Permission[];
}

export default function Index({ permissions }: IndexProps) {
    // Estados para los filtros reactivos
    const [searchQuery, setSearchQuery] = useState("");
    const [actionFilter, setActionFilter] = useState("all");

    // Estado para controlar si estamos editando en línea
    const [editingId, setEditingId] = useState<number | null>(null);

    // Formulario de Inertia para Crear / Editar rápidamente
    const { data, setData, post, put, reset, processing, errors } = useForm({
        name: "",
    });

    // Cambiar al modo edición precargando el string
    const startEdit = (permission: Permission) => {
        setEditingId(permission.id);
        setData("name", permission.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
    };

    // Envío del formulario (Sabe si es actualización o inserción)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/permissions/${editingId}`, {
                onSuccess: () => setEditingId(null),
            });
        } else {
            post("/permissions", {
                onSuccess: () => reset(),
            });
        }
    };

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
        router.delete(`/permissions/${idSeleccionado}`, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIdSeleccionado(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    // Filtrado interactivo (client-side)
    const filteredPermissions = permissions.filter((perm) => {
        const matchesSearch = perm.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        if (actionFilter === "all") return matchesSearch;

        return (
            matchesSearch && perm.name.toLowerCase().startsWith(actionFilter)
        );
    });

    const inputClass =
        "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    return (
        <>
            <Head title="Permisos Atómicos del Sistema" />

            <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Encabezado */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                                Permisos Atómicos del Sistema
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Lista de capacidades del sistema utilizadas para
                                la protección de controladores y vistas.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* COLUMNA IZQUIERDA: Formulario dinámico de Alta/Edición */}
                        <Card className="shadow-sm border-gray-200 overflow-hidden bg-white">
                            <CardHeader className="bg-white border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-2">
                                    {editingId ? (
                                        <Pencil className="w-4 h-4 text-indigo-600 shrink-0" />
                                    ) : (
                                        <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                                    )}
                                    <CardTitle className="text-lg font-bold text-gray-900">
                                        {editingId
                                            ? "Modificar Permiso"
                                            : "Registrar Permiso"}
                                    </CardTitle>
                                </div>
                            </CardHeader>

                            <form onSubmit={handleSubmit}>
                                <CardContent className="p-5 space-y-4 bg-white">
                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="permiso-nombre"
                                            className="block text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                        >
                                            Nombre Clave
                                        </label>
                                        <input
                                            id="permiso-nombre"
                                            type="text"
                                            placeholder="Ej: listar carreras"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-5 py-3.5 flex flex-col sm:flex-row gap-2.5">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {editingId
                                                    ? "Actualizando..."
                                                    : "Guardando..."}
                                            </>
                                        ) : editingId ? (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Actualizar
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Guardar
                                            </>
                                        )}
                                    </Button>

                                    {editingId && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={cancelEdit}
                                            className="w-full sm:w-auto bg-white"
                                        >
                                            <X className="w-4 h-4 mr-1.5" />
                                            Cancelar
                                        </Button>
                                    )}
                                </CardFooter>
                            </form>
                        </Card>

                        {/* COLUMNA DERECHA: Filtros y Tabla */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Barra de Filtros Interactivos */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Filtrar por nombre o módulo..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div className="w-full sm:w-47.5 shrink-0">
                                    <Select
                                        value={actionFilter}
                                        onValueChange={setActionFilter}
                                    >
                                        <SelectTrigger className="h-9.5 bg-white border-gray-300 text-gray-900 shadow-sm focus:ring-indigo-500">
                                            <SelectValue placeholder="Acción" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200">
                                            <SelectItem value="all">
                                                Todas las acciones
                                            </SelectItem>
                                            <SelectItem value="listar">
                                                Listar (index)
                                            </SelectItem>
                                            <SelectItem value="mostrar">
                                                Mostrar (show)
                                            </SelectItem>
                                            <SelectItem value="crear">
                                                Inserción (create)
                                            </SelectItem>
                                            <SelectItem value="editar">
                                                Modificación (edit)
                                            </SelectItem>
                                            <SelectItem value="eliminar">
                                                Eliminación (delete)
                                            </SelectItem>
                                            <SelectItem value="restaurar">
                                                Restauración (delete)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Tabla */}
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
                                                        Identificador Interno
                                                    </TableHead>
                                                    <TableHead className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="divide-y divide-gray-100 text-sm text-gray-700">
                                                {filteredPermissions.length ===
                                                0 ? (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={3}
                                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                                        >
                                                            Ningún permiso
                                                            coincide con los
                                                            filtros aplicados.
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    filteredPermissions.map(
                                                        (perm) => (
                                                            <TableRow
                                                                key={perm.id}
                                                                className="hover:bg-gray-50/70"
                                                            >
                                                                <TableCell className="px-6 py-3.5 text-center font-mono text-gray-900 whitespace-nowrap">
                                                                    #{perm.id}
                                                                </TableCell>
                                                                <TableCell className="px-6 py-3.5 text-center whitespace-nowrap">
                                                                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-md border border-indigo-200/80">
                                                                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                                                        <span>
                                                                            {
                                                                                perm.name
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="px-6 py-3.5 text-center whitespace-nowrap">
                                                                    <div className="inline-flex items-center justify-center gap-1.5">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                startEdit(
                                                                                    perm,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                editingId ===
                                                                                perm.id
                                                                            }
                                                                            className="h-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                                                            title="Editar permiso"
                                                                        >
                                                                            <Pencil className="w-4 h-4 mr-1.5" />
                                                                            Editar
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    perm.id,
                                                                                )
                                                                            }
                                                                            className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50 cursor-pointer"
                                                                            title="Eliminar permiso"
                                                                        >
                                                                            <Trash2 className="w-4 h-4 mr-1.5" />
                                                                            Eliminar
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ),
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>

                                <CardFooter className="bg-gray-50/70 border-t border-gray-100 px-6 py-3.5 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando{" "}
                                        <span className="font-semibold text-gray-900">
                                            {filteredPermissions.length}
                                        </span>{" "}
                                        de{" "}
                                        <span className="font-semibold text-gray-900">
                                            {permissions.length}
                                        </span>{" "}
                                        permisos
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
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
                                ¿Eliminar permiso?
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Estás a punto de borrar este permiso
                            permanentemente. ¿Desea continuar?
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
                                "Sí, eliminar permiso"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
