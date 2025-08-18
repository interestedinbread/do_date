import { useAuth } from "./contexts/useAuth"
import { updateUserAttributes } from "aws-amplify/auth"

type HomePageProps = {
    phoneNumber: string | null
    setPhoneNumber: (phoneNumber: string) => void
}

export function HomePage({ phoneNumber, setPhoneNumber }: HomePageProps) {

    const { logout, user } = useAuth()

    async function updatePhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        try {
            const result = await updateUserAttributes({
                userAttributes: {
                    phone_number: phoneNumber || ''
                }
            })
            console.log("Phone number updated successfully:", result)
        } catch (err) {
            console.error("Error updating phone number:", err)
        }    
    }

    const handleLogout = async () => {
        await logout()
    }

    return(
        <>
        <form
        onSubmit={updatePhoneNumber}>
            <h4>Enter your phone number to start setting reminders!</h4>
            <input placeholder="e.g. +11234567890"
            value={phoneNumber || ''}
            onChange={(e) => 
                setPhoneNumber(e.target.value)
            }/>
            <button type="submit">Update phone number</button>
        </form>
        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20">
            <h2 className="text-white text-2xl">What would you like to do?</h2>
            <button className="bg-green-400 border-2 border-yellow-300 p-2 rounded-md text-white"
            onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}