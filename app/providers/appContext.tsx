"use client"

import {UserProfile} from "oidc-client-ts";
import React, {createContext} from "react";

export interface AppState {
    user: UserProfile
    isInAdminGroup: boolean
}

export interface AppContextType {
    state: AppState | undefined
    setState: (state: AppState) => void
}


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({children}: { children: React.ReactNode }) => {
    const [state, setState] = React.useState<AppState>();

    return (
        <AppContext.Provider value={{state, setState}}>
            {children}
        </AppContext.Provider>
    )

}