"use client"

import * as React from "react"
import {Bot, GalleryVerticalEnd, SquareTerminal,} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useAuth} from "react-oidc-context";

const data = {
    company: {
        name: "AetherTasks",
        logo: GalleryVerticalEnd,
    },
    navMain: [
        {
            title: "Tasks",
            url: "/dashboard/tasks",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Open",
                    url: "/dashboard/tasks",
                },
                {
                    title: "Completed",
                    url: "/dashboard/tasks",
                },
                {
                    title: "All",
                    url: "/dashboard/tasks",
                },
            ],
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: Bot,
            items: [
                {
                    title: "All",
                    url: "/dashboard/users",
                },
            ]
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const auth = useAuth()
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <data.company.logo className="size-4"/>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {data.company.name}
                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user?.profile} onLogout={auth.removeUser}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
