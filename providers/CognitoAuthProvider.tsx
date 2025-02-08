"use client"

import {AuthProvider} from "react-oidc-context";

const cognitoAuthConfig = {
    authority: process.env.NEXT_PUBLIC_AUTHORITY,
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    response_type: "code",
    scope: "email openid profile",
}

export function CognitoAuthProvider({children}: { children: React.ReactNode }) {
    return (
        <AuthProvider {...cognitoAuthConfig}>
            {children}
        </AuthProvider>
    )
}