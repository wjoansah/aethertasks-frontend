import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import React from "react";
import {AppSidebar} from "@/components/app-sidebar";

export default function DashboardLayout({children}: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>

    )
}