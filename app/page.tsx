"use client"

import {useAuth} from "react-oidc-context";
import {Button} from "@/components/ui/button";
import {GalleryVerticalEnd} from "lucide-react";
import {redirect} from "next/navigation";
import {useContext} from "react";
import {AppContext, AppState} from "@/app/providers/appContext";
import {decodeJwt} from "@/lib/utils";

export default function Home() {
    const auth = useAuth()
    const context = useContext(AppContext)
    //
    // const signOutRedirect = () => {
    //     const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    //     const logoutUri = "http://localhost:3000";
    //     const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    //     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&redirect_uri=${encodeURIComponent(logoutUri)}&response_type=code`;
    // };


    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }


    if (auth.isAuthenticated) {
        const appState: Partial<AppState> = {};
        if (auth.user?.id_token) {
            const decodedToken = decodeJwt(auth.user.id_token);
            if (decodedToken !== null) {
                appState.isInAdminGroup = process.env.NEXT_PUBLIC_ADMIN_GROUP_NAME!! in decodedToken['cognito:groups'];
            }
        }
        if (auth.user && auth.user.profile) {
            appState.user = auth.user.profile;
            context?.setState(appState as AppState);
        }
        redirect("/dashboard");
        // return (
        //     <div>
        //         <pre> Hello: {auth.user?.profile.email} </pre>
        //         <pre> ID Token: {auth.user?.id_token} </pre>
        //         <pre> Access Token: {auth.user?.access_token} </pre>
        //         <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        //
        //         <button onClick={() => auth.removeUser()}>Sign out</button>
        //     </div>
        // );
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
