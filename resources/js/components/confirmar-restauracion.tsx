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
import { Loader2, RotateCcw } from "lucide-react";

interface ConfirmarRestauracionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isRestoring?: boolean;
    title?: string;
    itemLabel?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmarRestauracion({
    open,
    onOpenChange,
    onConfirm,
    isRestoring = false,
    title = "¿Restaurar registro?",
    itemLabel,
    description = "El registro volverá a estar activo en el sistema.",
    confirmText = "Sí, restaurar",
    cancelText = "Cancelar",
}: ConfirmarRestauracionProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-110 border-border/80 shadow-xl">
                <AlertDialogHeader className="gap-3">
                    <div className="flex items-start gap-3.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/30">
                            <RotateCcw className="h-5 w-5" />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <AlertDialogTitle className="text-lg font-semibold leading-snug">
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                                {itemLabel && (
                                    <span className="mb-1.5 block font-medium text-foreground">
                                        {itemLabel}
                                    </span>
                                )}
                                {description}
                            </AlertDialogDescription>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 gap-2 sm:gap-2">
                    <AlertDialogCancel disabled={isRestoring} className="mt-0">
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isRestoring}
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        className="bg-emerald-600! text-white! hover:bg-emerald-700! focus-visible:ring-emerald-600 dark:bg-emerald-600! dark:hover:bg-emerald-500!"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Restaurando...
                            </>
                        ) : (
                            confirmText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
