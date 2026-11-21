import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/routes";
import { store } from "@/routes/login";
import { request } from "@/routes/password";

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            <Form
                {...store.form()}
                resetOnSuccess={["password"]}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600 focus:border-indigo-600 focus:ring-0 focus:outline-none"
                                />
                                <Label htmlFor="remember">Recordarme</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            ¿No tenés una cuenta?{" "}
                            <TextLink
                                href={register()}
                                className="font-medium text-indigo-600 hover:text-indigo-700"
                                tabIndex={5}
                            >
                                Registrarte
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: "Iniciar sesión en tu cuenta",
    description: "Ingresá tu correo y contraseña para acceder al sistema",
};
