"use client"

import {useAuth} from "react-oidc-context";
import {Button} from "@/components/ui/button";
import {GalleryVerticalEnd} from "lucide-react";
import {redirect} from "next/navigation";
import {useStore} from '@/store'
import {UserRole} from "@/types";

export default function Home() {
    const store = useStore()
    const auth = useAuth()

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }


    if (auth.isAuthenticated) {
        if (auth.user && auth.user.profile) {
            const userRole = auth.user?.profile?.['custom:role']
            store.setRole(userRole as unknown as UserRole);
            store.setUserIsAdmin(userRole === "admin")
            store.setUserProfile(auth.user.profile)
        }
        redirect("/dashboard");
    }
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <a
                                    href="#"
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md">
                                        <GalleryVerticalEnd className="size-6"/>
                                    </div>
                                    <span className="sr-only">AetherTasks</span>
                                </a>
                                <h1 className="text-xl font-bold">Welcome to AetherTasks.</h1>
                            </div>
                            <div className="flex flex-col gap-6">
                                <Button className="w-full" onClick={() => auth.signinRedirect()}>
                                    Login
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div
                        className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    );
}

// <div>
//     <button onClick={() => auth.signinRedirect()}>Sign in</button>
//     <button onClick={() => signOutRedirect()}>Sign out</button>
// </div>
