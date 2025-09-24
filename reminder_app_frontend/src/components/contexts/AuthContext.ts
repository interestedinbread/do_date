import { createContext } from "react";

export type UserType = {
    username: string;
    email?: string;
    userId: string;
}

export type AuthContextType = {
    user: UserType | null,
    login: (username: string, password: string) => Promise<UserType | undefined>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
