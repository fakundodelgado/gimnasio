import { Form } from "@inertiajs/react";
import { useRef } from "react";
import ProfileController from "@/actions/App/Http/Controllers/Settings/ProfileController";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="mt-6 space-y-6">
            <Heading
                variant="small"
                title="Eliminar cuenta"
                description="Eliminá tu cuenta y todos sus recursos asociados"
            />
            <div className="space-y-4 rounded-xl border border-red-200/80 bg-red-50/80 p-4 shadow-2xs dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-700 dark:text-red-100">
                    <p className="font-medium">Advertencia</p>
                    <p className="text-sm">
                        Procedé con precaución, esta acción no se puede
                        deshacer.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            Eliminar cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="border-indigo-100/80">
                        <DialogTitle>
                            ¿Seguro que querés eliminar tu cuenta?
                        </DialogTitle>
                        <DialogDescription>
                            Una vez que se elimine tu cuenta, todos sus recursos
                            y datos se borrarán de forma permanente. Ingresá tu
                            contraseña para confirmar que querés eliminar tu
                            cuenta definitivamente.
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            Contraseña
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder="Contraseña"
                                            autoComplete="current-password"
                                            className="focus-visible:border-indigo-600 focus-visible:ring-indigo-600/20"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                Eliminar cuenta
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
