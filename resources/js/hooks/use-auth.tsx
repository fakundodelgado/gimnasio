import { usePage } from "@inertiajs/react";

export function useAuth() {
    const { auth } = usePage().props as any;

    const permissions: string[] = auth?.permissions || [];

    const can = (permission: string): boolean => {
        return permissions.includes(permission);
    };
    
    return { can, user: auth?.user };
}
