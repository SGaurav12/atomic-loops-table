import { hookstate } from "@hookstate/core";
import { useHookstate } from "@hookstate/core";

export const authState = hookstate({
    isAuthenticated: false,
    user: null as { email: string } | null,
    token: "",
    loading: false,
    error: "",
});

export function useAuthState() {
    const state = useHookstate(authState);

    console.log("Auth State:", state.get());
    if (
        state.get().isAuthenticated === undefined ||
        state.get().user === undefined ||
        state.get().token === undefined ||
        state.get().loading === undefined ||
        state.get().error === undefined
    ) {
        throw new Error("authState is missing properties. Check for multiple Hookstate instances or import paths.");
    }
    return {

        // updateState: ({ name: any, value: any }) {
        //     state.set((prev) => ({
        //         ...prev,
        //         [name]: value,
        //     }
        //     ));
        // },

        isAuthenticated: state.isAuthenticated.get(),
        setIsAuthenticated: (val: boolean) => state.isAuthenticated.set(val),

        user: state.user.get(),
        setUser: (val: { email: string } | null) => state.user.set(val),

        token: state.token.get(),
        setToken: (val: string) => state.token.set(val),

        loading: state.loading.get(),
        setLoading: (val: boolean) => state.loading.set(val),
        
        error: state.error?.get?.() ?? "",
        setError: (val: string) => state.error.set(val),
    };
}