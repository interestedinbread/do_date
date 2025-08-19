import { useState } from "react"
import { useAuth } from "./contexts/useAuth.ts"



type AuthPanelProps = {
    setAuthPanelOpen: React.Dispatch<React.SetStateAction<boolean>>
    loggingIn: boolean
    setLoggingIn: React.Dispatch<React.SetStateAction<boolean>>
    registering: boolean
    setRegistering: React.Dispatch<React.SetStateAction<boolean>>
}

export function AuthPanel( { 
    setAuthPanelOpen,
    loggingIn,
    setLoggingIn,
    setRegistering
 }: AuthPanelProps) {

const [username, setUsername] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const { login, register, logout } = useAuth()

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
        const user = await login(username, password)
        console.log("logged in:", user)
        setAuthPanelOpen(false)
    } catch (err) {
        console.error("Error loggin in:", err)
    }
    }

const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
        await register(username, email, password)
        console.log("Registered successfully");
        setAuthPanelOpen(false)
    } catch (err) {
        console.error("Error registering:", err)
    }
}

const handleLogout = async () => {
    await logout()
}

    return(
        <div className="bg-green-400 border-2 border-white rounded-lg p-4 mt-12 w-9/10 mx-auto">
            <form 
            className="flex flex-col"
            onSubmit={
                loggingIn? handleLogin : handleRegister
            }>

                <p className="text-white">Enter a username</p>
                <input 
                className="border-2 border-yellow-400 bg-white text-green-600 rounded-md"
                type="text" 
                placeholder="email goes here"
                onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                {!loggingIn && 
                <>
                    <p className="text-white">Enter your email</p>
                    <input 
                    className="border-2 border-yellow-400 bg-white text-green-600 rounded-md"
                    type="email" 
                    placeholder="email goes here"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </>
                }
                <p className="text-white">{loggingIn ? "Enter your password" : "Create a password"}</p>
                <input 
                className="border-2 border-yellow-400 bg-white text-green-600 rounded-md"
                type="password" 
                placeholder="password goes here"
                onChange={(e) => {
                    setPassword(e.target.value)
                }}/>

                <button type="submit"
                className="border-2 border-yellow-400 bg-white text-green-400 p-1 rounded-md w-max mt-2">Submit</button>
                
            </form>

            <div className="flex flex-col">
                <p className="text-white">{loggingIn ? "Need to create an account?" : "Already a user?"}</p>
                <button className="border-2 border-yellow-400 bg-white text-green-400 p-1 rounded-md w-max"
                onClick={() => {
                    setLoggingIn(prev => !prev)
                    setRegistering(prev => !prev)
                }}>{loggingIn ? "Register" : "Login"}</button>
                <button className="border-2 border-yellow-400 bg-white text-green-400 p-1 rounded-md w-max mt-2"
                onClick={() => setAuthPanelOpen(false)}>Go Back</button>
            </div>
        </div>
    )
}