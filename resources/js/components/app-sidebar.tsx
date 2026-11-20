import { Link } from "@inertiajs/react";
import { BookOpen, FolderGit2, LayoutGrid } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import {
    CalendarCheck,
    ShieldCheck,
    UserCog,
    Briefcase,
    KeyRound,
    ClipboardCheck,
    ClipboardList,
    CreditCard,
    Dumbbell,
    LayoutDashboard,
    LogIn,
    Users,
} from "lucide-react";
//import { useAuth } from '@/hooks/use-auth';

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutDashboard,
    },

    {
        title: "Clientes",
        href: "/clientes",
        icon: Users,
    },

    {
        title: "Empleados",
        href: "/empleados",
        icon: Briefcase,
    },

    {
        title: "Entrenadores",
        href: "/entrenadores",
        icon: Dumbbell,
    },

    {
        title: "Pagos",
        href: "/pagos",
        icon: CreditCard,
    },

    {
        title: "Planes",
        href: "/planes",
        icon: ClipboardList,
    },

    {
        title: "Registrar Ingreso",
        href: "/ingresos/create",
        icon: LogIn,
    },

    {
        title: "Listar Ingresos",
        href: "/ingresos",
        icon: ClipboardCheck,
    },

    {
        title: "Permisos",
        href: "/permissions",
        icon: ShieldCheck,
    },

    {
        title: "Roles",
        href: "/roles",
        icon: KeyRound,
    },

    {
        title: "Suscripciones",
        href: "/suscripciones",
        icon: CalendarCheck,
    },

    {
        title: "Usuarios",
        href: "/users",
        icon: UserCog,
    },
];

/*
const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];
*/

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="py-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-auto! py-2 hover:bg-transparent active:bg-transparent"
                        >
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
