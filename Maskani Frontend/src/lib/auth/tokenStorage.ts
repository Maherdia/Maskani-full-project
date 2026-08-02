import type { User } from "../../features/auth/types/auth.types";

const TOKEN_KEY = "maskani_token";
const USER_KEY = "maskani_user";

export const tokenService = {
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    getUser(): User | null {
        const json = localStorage.getItem(USER_KEY);

        if (!json)
            return null;

        return JSON.parse(json) as User;
    },

    setUser(user: User) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    removeUser() {
        localStorage.removeItem(USER_KEY);
    },

    clear() {
        this.removeToken();
        this.removeUser();
    }
};