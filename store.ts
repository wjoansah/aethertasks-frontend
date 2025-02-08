import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {UserProfile} from 'oidc-client-ts';
import {UserRole} from "@/types";

interface AppState {
    userProfile: UserProfile | null;
    role: UserRole;
    userIsAdmin: boolean;
    setUserProfile: (profile: UserProfile) => void;
    setUserIsAdmin: (isAdmin: boolean) => void;
    setRole: (role: UserRole) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            userProfile: null,
            role: 'user',
            userIsAdmin: false,
            setUserProfile: (userProfile) =>
                set((state) => ({
                    ...state,
                    userProfile,
                })),
            setRole: (role: UserRole) => set((state) => ({
                ...state,
                role
            })),
            setUserIsAdmin: (isAdmin: boolean) => set((state) => ({
                ...state,
                userIsAdmin: isAdmin
            }))
        }),
        {
            name: 'app-state',
            partialize: (state) => ({
                userProfile: state.userProfile,
                role: state.role,
                userIsAdmin: state.userIsAdmin,
            }),
        }
    )
);
