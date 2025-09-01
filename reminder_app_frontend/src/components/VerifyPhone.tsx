import { useEffect, useState } from "react"
import { updateUserAttributes, fetchAuthSession } from "aws-amplify/auth"

type VerifyPhoneProps = {
    phoneNumber: string | null
    setPhoneNumber: (phoneNumber: string) => void
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export function VerifyPhone({ phoneNumber, setPhoneNumber, isLoading, setIsLoading }: VerifyPhoneProps) {

    const [verificationCode, setVerificationCode] = useState('')
    const [verificationNeeded, setVerificationNeeded] = useState(false)
    const [phoneVerified, setPhoneVerified] = useState(false)

    useEffect(() => {
        checkPhoneVerificationStatus()
    }, [])

    async function checkPhoneVerificationStatus() {
        try {
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            if (!accessToken) {
                console.log('No access token available')
                return
            }

            const response = await fetch('http://localhost:3001/api/check-phone-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accessToken })
            })

            if (response.ok) {
                const data = await response.json()
                setPhoneVerified(data.phoneVerified)
                if (data.phoneNumber) {
                    setPhoneNumber(data.phoneNumber) 
                }
                console.log('Phone verification status:', data)
            }
        } catch (err) {
            console.error('Error checking phone verification status:', err)
        }
    }

    async function updatePhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        try {
            const result = await updateUserAttributes({
                userAttributes: {
                    phone_number: phoneNumber || ''
                }
            })
            console.log("Phone number updated successfully:", result)
            
            const response = await fetch('http://localhost:3001/api/send-verification-sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber })
            })

            if (response.ok) {
                console.log("SMS sent successfully")
                setVerificationNeeded(true)
            } else {
                throw new Error('Failed to send SMS')
            }
        } catch (err) {
            console.error("Error:", err)
        }    
    }



    async function confirmPhoneNumber(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try{
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            if(!accessToken) {
                throw new Error('No access token available')
            }

            const response = await fetch('http://localhost:3001/api/verify-phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber,
                    verificationCode,
                    accessToken
                })
            })

            if(response.ok) {
                console.log('Phone number verified successfully')
                setVerificationNeeded(false)
                setVerificationCode('')
                await checkPhoneVerificationStatus()
            } else {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Verification failed')
            }
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
            <form onSubmit={updatePhoneNumber}
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
            <form onSubmit={confirmPhoneNumber}>
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