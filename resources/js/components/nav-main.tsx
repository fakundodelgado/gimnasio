import { Link } from "@inertiajs/react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import type { NavItem } from "@/types";

export function NavMain({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-3 py-2 group-data-[collapsible=icon]:px-2">
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-2 transition-all group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
                <SidebarMenu className="space-y-1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={item.isActive}
                                tooltip={item.title}
                                className="justify-center rounded-lg text-gray-700 transition-colors hover:bg-indigo-100/70 hover:text-indigo-700 data-[active=true]:bg-white data-[active=true]:font-semibold data-[active=true]:text-indigo-600 data-[active=true]:shadow-2xs group-data-[collapsible=icon]:data-[active=true]:bg-indigo-50"
                            >
                                <Link
                                    href={item.href}
                                    className="flex w-full items-center justify-center gap-2.5 px-3 py-2 group-data-[collapsible=icon]:px-0"
                                >
                                    {item.icon && (
                                        <item.icon className="size-4 shrink-0" />
                                    )}
                                    <span className="truncate group-data-[collapsible=icon]:hidden">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </div>
        </SidebarGroup>
    );
}
