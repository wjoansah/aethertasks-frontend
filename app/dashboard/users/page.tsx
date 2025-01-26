"use client"

import {getUsers} from '@/actions/users'
import {CreateUserForm} from "@/components/create-user-form";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import {User} from "@/types";
import {useStore} from "@/store";
import {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";


export default function UsersPage() {
    const store = useStore();
    const auth = useAuth();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getUsersOnLoad = async () => {
            const usersRequest = await getUsers(auth.user?.id_token!)
            if (usersRequest.success)
                setUsers(usersRequest.data);
        }
        getUsersOnLoad();
    }, [auth]);

    return (
        <>
            <header
                className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center  gap-2 px-4">
                    <SidebarTrigger className="-ml-1"/>
                    <Separator orientation="vertical" className="mr-2 h-4"/>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Users
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="p-4 pt-0">
                <div className="container mx-auto py-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Users</h1>
                        <CreateUserForm/>
                    </div>
                    <div className="space-y-4">
                        {users && users.map((user: User, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        store.currentUserInAdminGroup
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
              {store.currentUserInAdminGroup && store.userProfile?.email! == user.email ? 'admin' : 'user'}
            </span>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <p className="text-center text-muted-foreground">No users found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

