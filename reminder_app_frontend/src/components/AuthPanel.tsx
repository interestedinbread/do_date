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
const { login, register } = useAuth()

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
        //  send username and password to amplify auth using the login function we set up in our auth provider file
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
        // send user data to amplify auth using function from auth provider
        await register(username, email, password)
        console.log("Registered successfully");
        setAuthPanelOpen(false)
    } catch (err) {
        console.error("Error registering:", err)
    }
}


    return(
        <div className="w-2/3 h-max p-2 bg-indigo-100 shadow-md rounded-lg mx-auto">
            <form 
            className="flex flex-col"
            onSubmit={
                loggingIn? handleLogin : handleRegister
            }>

                <p className="text-indigo-600 inter-bold">Enter a username</p>
                <input 
                className="shadow-md bg-white text-gray-600 rounded-md pl-2 mt-2"
                type="text" 
                placeholder="username"
                onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
                {!loggingIn && 
                <>
                    <p className="text-indigo-600 inter-bold mt-2">Enter your email</p>
                    <input 
                    className="shadow-md bg-white text-gray-600 rounded-md mt-2 pl-2"
                    type="email" 
                    placeholder="email goes here"
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </>
                }
                <p className="text-indigo-600 inter-bold mt-2">{loggingIn ? "Enter your password" : "Create a password"}</p>
                <input 
                className="shadow-md bg-white text-gray-600 rounded-md pl-2 mt-2"
                type="password" 
                placeholder="password"
                onChange={(e) => {
                    setPassword(e.target.value)
                }}/>

                <button type="submit"
                className="bg-white px-2 rounded-md text-green-500 w-max shadow-md my-2">Submit</button>
                
            </form>

            <div className="flex flex-col">
                <p className="text-indigo-600 inter-bold">{loggingIn ? "Need to create an account?" : "Already a user?"}</p>
                <button className="shadow-md bg-white text-green-500 p-1 rounded-md w-max mt-1"
                onClick={() => {
                    setLoggingIn(prev => !prev)
                    setRegistering(prev => !prev)
                }}>{loggingIn ? "Register" : "Login"}</button>
            </div>
        </div>
    )
}