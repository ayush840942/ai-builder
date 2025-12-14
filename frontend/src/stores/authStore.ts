import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    plan: 'free' | 'pro' | 'enterprise';
    credits: number;
    creditsUsed: number;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    useCredit: () => boolean;
    getCreditsRemaining: () => number;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) => {
                // Set default credits for new users
                const userWithCredits = {
                    ...user,
                    plan: user.plan || 'free',
                    credits: user.credits || 10,
                    creditsUsed: user.creditsUsed || 0,
                    createdAt: user.createdAt || new Date().toISOString(),
                };
                set({ user: userWithCredits, token, isAuthenticated: true });
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            },

            updateUser: (userData) => {
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                }));
            },

            useCredit: () => {
                const state = get();
                if (!state.user) return false;

                const creditsRemaining = state.user.credits - state.user.creditsUsed;
                if (creditsRemaining <= 0) return false;

                set((s) => ({
                    user: s.user ? { ...s.user, creditsUsed: s.user.creditsUsed + 1 } : null,
                }));
                return true;
            },

            getCreditsRemaining: () => {
                const state = get();
                if (!state.user) return 0;
                return Math.max(0, state.user.credits - state.user.creditsUsed);
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
