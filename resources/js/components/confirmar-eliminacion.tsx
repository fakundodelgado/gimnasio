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
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting?: boolean;
    title: string;
    description?: string;
    itemLabel?: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    isDeleting = false,
    title,
    description = "¿Desea continuar?",
    itemLabel,
    confirmText = "Sí, eliminar",
    cancelText = "Volver",
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-106.25 bg-white border-gray-200">
                <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-full shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <AlertDialogTitle className="text-xl text-gray-900">
                            {title}
                        </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                        {itemLabel ? (
                            <>
                                Estás a punto de eliminar{" "}
                                <span className="font-semibold text-gray-800">
                                    {itemLabel}
                                </span>
                                . {description}
                            </>
                        ) : (
                            description
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
                    <AlertDialogCancel
                        disabled={isDeleting}
                        onClick={() => onOpenChange(false)}
                        className="bg-white"
                    >
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isDeleting}
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm transition-colors duration-200 cursor-pointer"
                    >
                        {isDeleting ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Eliminando...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
