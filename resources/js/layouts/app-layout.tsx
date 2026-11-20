import { usePage } from "@inertiajs/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import AppLayoutTemplate from "@/layouts/app/app-sidebar-layout";

interface SharedProps {
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function AppLayout({
    children,
    ...props
}: {
    children: React.ReactNode;
    [key: string]: unknown;
}) {
    const { props: pageProps, url } = usePage<SharedProps>();
    const flash = pageProps.flash;
    const ocultarFlashGlobal = url.startsWith("/ingresos/create");

    return (
        <AppLayoutTemplate {...props}>
            {!ocultarFlashGlobal && (flash?.error || flash?.success) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-2.5">
                    {flash?.error && (
                        <div
                            role="alert"
                            className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-sm"
                        >
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>{flash.error}</span>
                        </div>
                    )}

                    {flash?.success && (
                        <div
                            role="status"
                            className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}
                </div>
            )}
            {children}
        </AppLayoutTemplate>
    );
}
