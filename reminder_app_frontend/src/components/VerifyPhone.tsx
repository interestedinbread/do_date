import { useEffect, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import { checkPhoneVerificationStatus, updatePhoneNumber, confirmPhoneNumber } from "../api/phoneApi"

type VerifyPhoneProps = {
    phoneNumber: string | null
    setPhoneNumber: (phoneNumber: string) => void
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function VerifyPhone({ phoneNumber, setPhoneNumber, isLoading, setIsLoading }: VerifyPhoneProps) {

    const [verificationCode, setVerificationCode] = useState('')
    // this will alternate when the user has submitted a number and needs to input confirmation code.
    const [verificationNeeded, setVerificationNeeded] = useState(false)

    const [phoneVerified, setPhoneVerified] = useState(false)

    useEffect(() => {
        handleCheckPhoneVerification()
    }, [])

    async function handleCheckPhoneVerification() {
        try {
            // get accesstoken from session object by calling fetchAuthSession
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            // if there is no token we have an error
            if (!accessToken) {
                console.log('No access token available')
                return
            }

            const response = await checkPhoneVerificationStatus(accessToken)

            setPhoneVerified(response.phoneVerified)
            if (response.phoneNumber) {
                setPhoneNumber(response.phoneNumber) 
            }
            console.log('Phone verification status:', response)

        } catch (err) {
            console.error('Error checking phone verification status:', err)
        }
    }

    async function handleUpdatePhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        try {
            await updatePhoneNumber(phoneNumber)

            console.log("SMS sent successfully")
            setVerificationNeeded(true)
            
        } catch (err) {
            console.error("Error:", err)
        }    
    }

    async function handleConfirmPhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try{
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            if(!accessToken) {
                throw new Error('No access token available')
            }

            await confirmPhoneNumber(phoneNumber, verificationCode, accessToken)
            
            console.log('Phone number verified successfully')
            setVerificationNeeded(false)
            setVerificationCode('')
            await handleCheckPhoneVerification()
            
        } catch (err) {
            console.error('Error verifying phone number:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <>
        {!phoneVerified && <div className="bg-indigo-100 shadow-md rounded-lg p-2 w-9/10 mt-10 mx-auto">
        {!verificationNeeded ? (
            <form onSubmit={handleUpdatePhoneNumber}
            className="flex flex-col">
                <h4 className="text-indigo-600 inter-regular text-lg">Enter your phone number below to start setting reminders!</h4>
                <input className="shadow-md bg-white rounded-md pl-2 my-2 w-max"
                placeholder="e.g. +11234567890"
                value={phoneNumber || ''}
                onChange={(e) => 
                    setPhoneNumber(e.target.value)
                }/>
                <button type="submit"
                className="bg-white text-green-600 rounded-md px-2 w-max shadow-md my-2">Set phone number</button>
            </form>
        ) : (
            <form onSubmit={handleConfirmPhoneNumber}>
                <h4 className="text-white text-xl">Enter the verification code sent to your phone</h4>
                <input className="shadow-md bg-white text-gray-600 rounded-md pl-2 my-2 w-max"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => 
                    setVerificationCode(e.target.value)
                }/>
                <button type="submit"
                disabled={isLoading}
                className="bg-white text-green-600 shadow-md rounded-md p-2">{isLoading ? 'Verifying...' : 'Confirm phone number'}</button>
            </form>
        )
        }
        </div>}

        </>
    )
}