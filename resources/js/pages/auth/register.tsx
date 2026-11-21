import { Form, Head } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/routes";
import { store } from "@/routes/register";

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Registrarse" />
            <Form
                {...store.form()}
                resetOnSuccess={["password", "password_confirmation"]}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contraseña"
                                    passwordrules={passwordRules}
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={passwordRules}
                                    className="rounded-lg border-gray-300 bg-white focus:border-2 focus:border-blue-600 focus:ring-0 focus:outline-none focus-visible:border-2 focus-visible:border-blue-600 focus-visible:ring-0 focus-visible:outline-none"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Crear cuenta
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿Ya tenés una cuenta?{" "}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className="font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Iniciar sesión
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: "Crear una cuenta",
    description: "Ingresá tus datos a continuación para crear tu cuenta",
};
