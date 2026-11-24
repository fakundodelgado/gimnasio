import { usePage } from "@inertiajs/react";

import AppLogoIcon from "@/components/app-logo-icon";

export function AppLogo({ className = "" }: { className?: string }) {
    return (
        <div
            className={`w-full flex items-center justify-center py-1 ${className}`}
        >
            <img
                src="/favicon.svg"
                alt="Logo del Gimnasio"
                className="w-full max-w-36.25 h-auto object-contain"
            />
        </div>
    );
}

export default AppLogo;
