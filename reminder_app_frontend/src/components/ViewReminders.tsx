import { useState, useEffect } from "react"
import { getReminders } from "../api/reminderApi"
import { fetchAuthSession } from "aws-amplify/auth"

type ViewRemindersProps = {
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface Reminder {
    reminderId: string;
    title: string;
    description: string;
    reminder_time: string;
    createdAt: string;
    sent: boolean;
}

export function ViewReminders ({ setViewRemindersOpen }: ViewRemindersProps) {

    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReminders()
    }, [])

    const fetchReminders = async () => {

        try{
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            if(!accessToken){
                console.error('No access token available')
                return
            }

            const result = await (getReminders(accessToken))
            if(result.success && result.reminders) {
                setReminders(result.reminders)
            }

            console.log(result)

        } catch (err) {
            console.error('Error fetching reminders:', err)
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20">
                { loading ? (
                    <p>Loading Reminders...</p>
                ) : reminders.length === 0 ? (
                    <p>No reminders found!</p>
                ) : (
                    <div>{
                        reminders.map((reminder) => (
                            <div key={reminder.reminderId}>
                                <h4>{reminder.title}</h4>
                                <p>{reminder.description}</p>
                                <p>{
                                    new Date(reminder.reminder_time).toLocaleString()
                                }</p>
                            </div>
                        ))
                        }
                    </div>
                )}
            
            <button 
            onClick={() => {
                setViewRemindersOpen(false)
            }}
            className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max">Go Back</button>
        </div>
    )
}