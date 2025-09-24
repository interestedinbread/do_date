import { updateUserAttributes } from "aws-amplify/auth";

const API_BASE = import.meta.env.NEXT_PUBLIC_VITE_API_URL;

export const checkPhoneVerificationStatus = async (accessToken: string): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE}/api/check-phone-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ accessToken })
        })

        if(!response.ok){
            throw new Error(`Could not verify number, ${response.status}`)
        }

        return response.json()
    } catch (err){
        console.error('Error verifying phone number:', err)
        throw err
    }
}

export const updatePhoneNumber = async (phoneNumber: string | null): Promise<any> => {

    try{
        const result = await updateUserAttributes({
            userAttributes: {
                phone_number: phoneNumber || ''
            }
        })

        console.log("Phone number updated successfully:", result)

        const response = await fetch(`${API_BASE}/api/send-verification-sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        })

        if(!response.ok){
            throw new Error(`Failed to send sms: ${response.status}`)
        }

        return response.json()
    } catch (err) {
        console.error('Error sending confirmation code:', err)
        throw err
    }
}

export const confirmPhoneNumber = async (phoneNumber: string | null, verificationCode: string, accessToken: string): Promise<any> => {
    try{
        const response = await fetch(`${API_BASE}/api/verify-phone`, {
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

        if(!response.ok){
            throw new Error(`Error verifying phone number ${response.status}`)
        }
        return response.json()
    } catch (err) {
        console.error('Could not verify phone number:', err)
        throw err
    }
}