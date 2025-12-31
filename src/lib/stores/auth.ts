import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Demo user for development/testing
export const DEMO_USER = {
    id: 'demo-user-001',
    email: 'demo@retailfluencer.com',
    name: 'Demo Brand Manager',
    brandId: 'demo-brand-001',
    brandName: 'Demo Brand',
    role: 'admin' as const,
};

export const DEMO_CREDENTIALS = {
    email: 'demo@retailfluencer.com',
    password: 'demo123',
};

export interface User {
    id: string;
    email: string;
    name: string;
    brandId: string;
    brandName: string;
    role: 'admin' | 'manager' | 'viewer';
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
    error: null,
};

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    // Check localStorage on init (client-side only)
    if (browser) {
        const stored = localStorage.getItem('retailfluencer_auth');
        if (stored) {
            try {
                const user = JSON.parse(stored);
                set({ user, isLoading: false, error: null });
            } catch {
                set({ user: null, isLoading: false, error: null });
            }
        } else {
            set({ user: null, isLoading: false, error: null });
        }
    }

    return {
        subscribe,

        login: (email: string, password: string): boolean => {
            update(state => ({ ...state, isLoading: true, error: null }));

            // Hardcoded demo auth
            if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
                if (browser) {
                    localStorage.setItem('retailfluencer_auth', JSON.stringify(DEMO_USER));
                }
                set({ user: DEMO_USER, isLoading: false, error: null });
                return true;
            }

            set({ user: null, isLoading: false, error: 'Invalid credentials' });
            return false;
        },

        logout: () => {
            if (browser) {
                localStorage.removeItem('retailfluencer_auth');
            }
            set({ user: null, isLoading: false, error: null });
        },

        clearError: () => {
            update(state => ({ ...state, error: null }));
        },
    };
}

export const auth = createAuthStore();

// Derived stores for convenient access
export const user = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => !!$auth.user);
export const isLoading = derived(auth, $auth => $auth.isLoading);
export const authError = derived(auth, $auth => $auth.error);
