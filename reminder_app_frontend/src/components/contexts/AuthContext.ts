import { createContext } from "react";

export type AuthContextType = {
    user: {
        username: string;
        email?: string;
        userId: string;
    } | null,
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
