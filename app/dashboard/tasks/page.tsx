"use client"

import {CreateTaskForm} from "@/components/create-task-form";
import {getTasks} from "@/actions/tasks";
import {getUsers} from "@/actions/users";
import {TaskList} from "@/app/dashboard/tasks/task-list";
import {User, Task} from "@/types";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {useEffect, useState} from "react";
import {useAuth} from "react-oidc-context";
import {useStore} from '@/store'

export default function TasksPage() {
    const auth = useAuth()
    const store = useStore()
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getTasksOnLoad = async () => {
            const tasks = await getTasks(store.currentUserInAdminGroup, auth.user?.id_token!)
            if (store.currentUserInAdminGroup) {
                const response = await getUsers(auth.user?.id_token!)
                if (response.success) {
                    const filteredUsers = response.data.filter((user: User) => !(store.currentUserInAdminGroup && user.email == store.userProfile?.email))
                    setUsers(filteredUsers);
                }
            }
            setTasks(tasks);
        }
        getTasksOnLoad()
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
                                    Tasks
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="p-4 pt-0">
                <div className="container mx-auto py-6 space-y-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Tasks</h1>
                        {store.currentUserInAdminGroup && (
                            <CreateTaskForm users={users}/>
                        )}
                    </div>
                    <TaskList tasks={tasks} currentUserIsAdmin={store.currentUserInAdminGroup} users={users}/>
                </div>
            </div>
        </>
    )
}

