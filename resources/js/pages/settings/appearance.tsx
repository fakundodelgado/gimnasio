import { Head } from "@inertiajs/react";
import AppearanceTabs from "@/components/appearance-tabs";
import Heading from "@/components/heading";
import { edit as editAppearance } from "@/routes/appearance";

export default function Appearance() {
    return (
        <>
            <Head title="Configuración de apariencia" />

            <h1 className="sr-only">Configuración de apariencia</h1>

            <div className="space-y-6 rounded-xl bg-white p-6">
                <Heading
                    variant="small"
                    title="Configuración de apariencia"
                    description="Actualizá la configuración de apariencia de tu cuenta"
                />
                <div className="[&_button[data-state=active]]:bg-indigo-600 [&_button[data-state=active]]:text-white [&_button:hover]:bg-indigo-50 [&_button:hover]:text-indigo-700">
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: "Configuración de apariencia",
            href: editAppearance(),
        },
    ],
};
