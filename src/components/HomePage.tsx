import { useState } from "react"
import { useAuth } from "./contexts/useAuth"
import { updateUserAttributes, confirmUserAttribute } from "aws-amplify/auth"

type HomePageProps = {
    phoneNumber: string | null
    setPhoneNumber: (phoneNumber: string) => void
}

export function HomePage({ phoneNumber, setPhoneNumber }: HomePageProps) {

    const { logout, user } = useAuth()
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationNeeded, setVerificationNeeded] = useState(false)

    async function updatePhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        try {
            const result = await updateUserAttributes({
                userAttributes: {
                    phone_number: phoneNumber || ''
                }
            })
            console.log("Phone number updated successfully:", result)
            setVerificationNeeded(true)
        } catch (err) {
            console.error("Error updating phone number:", err)
        }    
    }

    async function confirmPhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        try{
            const result = await confirmUserAttribute({
                userAttributeKey: 'phone_number',
                confirmationCode: verificationCode
            })
            console.log('Phone number confirmed:', result)
            setVerificationNeeded(false)
            setVerificationCode('')
        } catch (err) {
            console.error('Error confirming phone number:', err)
        }
    }

    const handleLogout = async () => {
        await logout()
    }

    return(
        <>
        <div className="bg-green-400 rounded-lg p-2 w-9/10 mt-20 mx-auto">
        {!verificationNeeded ? (
            <form onSubmit={updatePhoneNumber}>
                <h4 className="text-white text-xl">Enter your phone number to start setting reminders!</h4>
                <input className="border-2 border-yellow-300 bg-white rounded-md pl-2 my-2"
                placeholder="e.g. +11234567890"
                value={phoneNumber || ''}
                onChange={(e) => 
                    setPhoneNumber(e.target.value)
                }/>
                <button type="submit"
                className="bg-yellow-300 rounded-md p-2">Update phone number</button>
            </form>
        ) : (
            <form onSubmit={confirmPhoneNumber}>
                <h4 className="text-white text-xl">Enter the verification code sent to your phone</h4>
                <input className="border-2 border-yellow-300 bg-white rounded-md pl-2 my-2"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => 
                    setVerificationCode(e.target.value)
                }/>
                <button type="submit"
                className="bg-yellow-300 rounded-md p-2">Confirm phone number</button>
            </form>
        )
        }
        </div>

        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20">
            <h2 className="text-white text-2xl">What would you like to do?</h2>
            <button className="bg-green-400 border-2 border-yellow-300 p-2 rounded-md text-white"
            onClick={handleLogout}>Logout</button>
        </div>
        </>
    )
}