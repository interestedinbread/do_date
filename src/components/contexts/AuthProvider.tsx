import { useEffect, useState, type ReactNode } from "react";
import { signIn, signUp, signOut, getCurrentUser } from "aws-amplify/auth";
import { AuthContext } from "./AuthContext";

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser)
            } catch {
                setUser(null)
            }
        }

        fetchUser()
    }, [])

    const login = async (email: string, password: string) => {
        const signedInUser = await signIn({ username: email, password });
        setUser(signedInUser)
    }

    const register = async (username: string, email: string, password: string) => {
        const result = await signUp({
            username,
            password,
            options: {
                userAttributes: {
                    email
                }
            }
        })
        console.log("Registration result:", result)
    }

    const logout = async () => {
        await signOut();
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )

}