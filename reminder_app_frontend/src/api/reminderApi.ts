interface ReminderData {
    title: string;
    description: string;
    reminder_time: string;
    accessToken: string;
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

const API_BASE = import.meta.env.NEXT_PUBLIC_VITE_API_URL

export const addReminder = async (reminderData: ReminderData): Promise<ApiResponse> => {  
    try{

        const response = await fetch(`${API_BASE}/api/add-reminder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

export const getReminders = async (accessToken: string | undefined) => {

    try{
        console.log(accessToken)
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

export const deleteReminder = async (reminderId: string, accessToken: string | undefined): Promise<ApiResponse> => {

    try {
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