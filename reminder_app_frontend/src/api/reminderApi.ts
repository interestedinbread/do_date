interface ReminderData {
    title: string;
    description: string;
    reminder_time: string;
    timezone: string;
}

interface Reminder {
    userId: string;
    reminderId: string;
    title: string;
    description: string;
    reminder_time: string;
    createdAt: string;
    sent: boolean;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    reminders?: Reminder[];
}

import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = import.meta.env.VITE_API_URL

export const addReminder = async (reminderData: ReminderData): Promise<ApiResponse> => {  
    try{
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        
        console.log('API_BASE:', API_BASE)
        console.log('Access token length:', accessToken?.length)
        
        if (!accessToken) {
            throw new Error('No access token available')
        }

        const response = await fetch(`${API_BASE}/api/add-reminder`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(reminderData)
        })
        if(!response.ok){
            throw new Error(`Failed to add reminder: ${response.status}`)
        }
        return response.json()
    } catch (err) {
        console.error('Error:', err)
        throw err
    }
}

export const getReminders = async (): Promise<ApiResponse> => {
    try{
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        
        if (!accessToken) {
            throw new Error('No access token available')
        }

        const response = await fetch(`${API_BASE}/api/get-reminders`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if(!response.ok){
            throw new Error(`Failed to get reminders: ${response.status}`)
        }
        return response.json()
    } catch (err) {
        console.error('Error:', err)
        throw err
    }
}

export const deleteReminder = async (reminderId: string): Promise<ApiResponse> => {
    try {
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()
        
        if (!accessToken) {
            throw new Error('No access token available')
        }

        const response = await fetch(`${API_BASE}/api/delete-reminder/${reminderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        if(!response.ok){
            throw new Error(`Failed to delete reminder: ${response.status}`)
        }
        return response.json()
    } catch (err) {
        console.error('Error:', err)
        throw err 
    }
}