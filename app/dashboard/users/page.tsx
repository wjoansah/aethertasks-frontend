import {getUsers} from '@/actions/users'
import {CreateUserForm} from "@/components/create-user-form";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList} from "@/components/ui/breadcrumb";

// Simulated authentication
const currentUser = {
    role: 'admin'
}

export default async function UsersPage() {
    // Redirect if not admin
    if (currentUser.role !== 'admin') {
        return null
    }

    const users = await getUsers()

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
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="rounded-lg border p-4 flex items-center justify-between"
                            >
                                <div>
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
              {user.role}
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

