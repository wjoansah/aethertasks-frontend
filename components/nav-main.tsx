"use client"

import {type LucideIcon} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import {useStore} from '@/store'
import {useState} from "react";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        requiresAdminAccess: boolean,
    }[]
}) {
    const store = useStore()
    const filteredItems = items.filter(
        item => !item.requiresAdminAccess || (item.requiresAdminAccess && store.currentUserInAdminGroup)
    )
    const [activeItem, setActiveItem] = useState<string>(items[0].title)
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {filteredItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.title === activeItem}
                                           onClick={() => setActiveItem(item.title)}>
                            <Link href={item.url}>
                                {item.icon && <item.icon/>}
                                {item.title}
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
