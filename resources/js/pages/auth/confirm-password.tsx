import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { store } from "@/routes/password/confirm";

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmar contraseña" />

            <Form {...store.form()} resetOnSuccess={["password"]}>
                {({ processing, errors }) => (
                    <div className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                autoFocus
                                className="focus-visible:border-indigo-600 focus-visible:ring-indigo-600/20"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center">
                            <Button
                                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Confirmar contraseña
                            </Button>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: "Confirmar contraseña",
    description:
        "Esta es una zona segura del sistema. Por favor, confirmá tu contraseña antes de continuar.",
};
