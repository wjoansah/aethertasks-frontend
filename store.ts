import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {UserProfile} from 'oidc-client-ts';

interface AppState {
    userProfile: UserProfile | null;
    currentUserInAdminGroup: boolean;
    setUserProfile: (profile: UserProfile) => void;
    setCurrentUserInAdminGroup: (state: boolean) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            userProfile: null,
            currentUserInAdminGroup: false,
            setUserProfile: (userProfile) =>
                set((state) => ({
                    ...state,
                    userProfile,
                })),
            setCurrentUserInAdminGroup: (value) =>
                set((state) => ({
                    ...state,
                    currentUserInAdminGroup: value,
                })),
        }),
        {
            name: 'app-state',
            partialize: (state) => ({
                userProfile: state.userProfile,
                currentUserInAdminGroup: state.currentUserInAdminGroup,
            }),
        }
    )
);
