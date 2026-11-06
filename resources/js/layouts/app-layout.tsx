import { usePage } from "@inertiajs/react";
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
    const { flash } = usePage<SharedProps>().props;

    return (
        <AppLayoutTemplate {...props}>
            {(flash?.error || flash?.success) && (
                <div className="px-4 pt-4">
                    {flash?.error && (
                        <div
                            style={{
                                color: "#721c24",
                                backgroundColor: "#f8d7da",
                                borderColor: "#f5c6cb",
                                padding: "10px 15px",
                                marginBottom: "10px",
                                borderRadius: "4px",
                                border: "1px solid transparent",
                                fontWeight: "bold",
                            }}
                        >
                            {flash.error}
                        </div>
                    )}

                    {flash?.success && (
                        <div
                            style={{
                                color: "#155724",
                                backgroundColor: "#d4edda",
                                borderColor: "#c3e6cb",
                                padding: "10px 15px",
                                marginBottom: "10px",
                                borderRadius: "4px",
                                border: "1px solid transparent",
                                fontWeight: "bold",
                            }}
                        >
                            {flash.success}
                        </div>
                    )}
                </div>
            )}
            {children}
        </AppLayoutTemplate>
    );
}
