import { useEffect, useState } from "react"
import { useAuth } from "./contexts/useAuth"
import { fetchAuthSession } from "aws-amplify/auth"
import { checkPhoneVerificationStatus, updatePhoneNumber, confirmPhoneNumber } from "../api/phoneApi"

type VerifyPhoneProps = {
    phoneNumber: string | null
    setPhoneNumber: (phoneNumber: string) => void
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    verifying: boolean
    setVerifying: React.Dispatch<React.SetStateAction<boolean>>
    phoneVerified: boolean,
    setPhoneVerified: React.Dispatch<React.SetStateAction<boolean>>
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    setModalMessage: React.Dispatch<React.SetStateAction<string>>
}

export function VerifyPhone({ 
    phoneNumber, 
    setPhoneNumber, 
    isLoading, 
    setIsLoading,
    verifying,
    setVerifying,
    phoneVerified,
    setPhoneVerified,
    setShowModal,
    setModalMessage 
}: VerifyPhoneProps) {

    const [verificationCode, setVerificationCode] = useState('')
    // this will alternate when the user has submitted a number and needs to input confirmation code.
    const [verificationNeeded, setVerificationNeeded] = useState(false)

    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }

    useEffect(() => {
        handleCheckPhoneVerification()
    }, [])

    async function handleCheckPhoneVerification() {
        try {
            setVerifying(true)
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
        } finally {
            setVerifying(false)
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
            setModalMessage("Could not save phone number. Please make sure you entered your number correctly.")
            setShowModal(true)
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
            setModalMessage('Phone number verified. You may now set reminders!')
            setShowModal(true)
            await handleCheckPhoneVerification()
            
        } catch (err) {
            console.error('Error verifying phone number:', err)
            setModalMessage('Please check verification code and try again')
        } finally {
            setIsLoading(false)
        }
    }

    if(phoneVerified){
        return null
    }

    return(
       <>
        <div className="bg-indigo-100 shadow-md rounded-lg p-4 mt-8 w-max mx-auto">
            <div className="flex gap-8">
                <h3 className="text-indigo-600 inter-bold text-2xl mt-1">One last step!</h3>
                <img src="/img/noun-phone-8036162-007435.png" className="h-[40px] w-[40px]"></img>
            </div>
        </div>
        {verifying ? (<div>
            <h2 className="text-indigo-600 inter-regular text-center mt-10 text-lg">Verifying Phone...</h2>
            </div>
            ) : (
            <div className="bg-indigo-100 shadow-md rounded-lg p-4 w-9/10 mt-10 mx-auto">
                {!verificationNeeded ? (
                    <form onSubmit={handleUpdatePhoneNumber}
                    className="flex flex-col">
                    <h4 className="italic text-lg">Enter your phone number below to start setting reminders!</h4>
                    <p className="italic text-lg my-2">Please also include your country code beginning with a + sign.</p>
                    <input className="shadow-md bg-white rounded-md pl-2 my-2 w-max"
                    placeholder="e.g. +11234567890"
                    value={phoneNumber || ''}
                    onChange={(e) => 
                        setPhoneNumber(e.target.value)
                    }/>
                    <div className="flex gap-8">
                        <button type="submit"
                        className="bg-white text-green-600 rounded-md px-2 w-max shadow-md my-2">Set phone number</button>
                        <button
                        className="bg-white text-green-600 rounded-md px-2 w-max shadow-md my-2"
                        onClick={() => {
                            handleLogout()
                        }}>Logout</button>
                    </div>
                    </form>
                ) : (
                    <form onSubmit={handleConfirmPhoneNumber}>
                    <h4 className="italic text-lg">Enter the verification code sent to your phone</h4>
                    <input className="shadow-md bg-white text-gray-600 rounded-md pl-2 my-4 w-max"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => 
                        setVerificationCode(e.target.value)
                    }/>
                    <button type="submit"
                    disabled={isLoading}
                    className="bg-white text-green-600 shadow-md rounded-md px-2 my-4 ml-4">{isLoading ? 'Verifying...' : 'Confirm phone number'}</button>
                    </form>
                )
                }
            </div>)
        }
        <div className="bg-indigo-100 shadow-md rounded-lg p-4 w-9/10 mt-10 mx-auto flex gap-4">
            <img src="/img/noun-cellphone-8069273-4C25E1.png" className="h-[50px] w-[50px]"/>
            <p className="italic">Your reminders will arrive from <br /> +1 (970) 715-6584</p>
        </div>
    </> 
    )
}