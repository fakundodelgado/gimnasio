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
                <div className="pointer-events-none fixed inset-x-0 top-3.5 z-50 flex justify-center px-4 sm:px-6 md:pl-64">
                    <div className="flex w-full max-w-3xl flex-col gap-2.5">
                        {flash?.success && (
                            <div className="pointer-events-auto flex min-h-12 items-center justify-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-2 text-[15px] font-medium text-emerald-800 shadow-sm">
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                                <span className="leading-snug">
                                    {flash.success}
                                </span>
                            </div>
                        )}

                        {flash?.error && (
                            <div className="pointer-events-auto flex min-h-12 items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-2 text-[15px] font-medium text-red-800 shadow-sm">
                                <AlertCircle className="size-5 shrink-0 text-red-600" />
                                <span className="leading-snug">
                                    {flash.error}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {children}
        </AppLayoutTemplate>
    );
}
