import { useState, useEffect, useMemo } from "react"
import { getReminders, deleteReminder } from "../api/reminderApi"
import { fetchAuthSession } from "aws-amplify/auth"

type ViewRemindersProps = {
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>
}

// each reminder returned by the api will have this structure :)
interface Reminder {
    reminderId: string;
    title: string;
    description: string;
    reminder_time: string;
    createdAt: string;
    sent: boolean;
}

// this component will display our reminders
export function ViewReminders ({ setViewRemindersOpen }: ViewRemindersProps) {

    const [reminders, setReminders] = useState<Reminder[]>([])
    // we initialize this as true because useEffect will fetchreminders on component mount
    const [loading, setLoading] = useState(true)
    // we will use this state to switch between showing sent and unsent reminders
    const [showUpcomingReminders, setShowUpcomingReminders] = useState(true)
    // we use a string here instead of an array because it is only one item at a time
    const [removingItem, setRemovingItem] = useState<string | null>(null)

    useEffect(() => {
        fetchReminders()
    }, [])

    const fetchReminders = async () => {

        try{
            // here we grab the access token 
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            // if check for no access token
            if(!accessToken){
                console.error('No access token available')
                return
            }

            // call function imported from our api folder
            const result = await (getReminders(accessToken))
            if(result.success && result.reminders) {
                setReminders(result.reminders)
            }
            
        } catch (err) {
            console.error('Error fetching reminders:', err)
        } finally {
            setLoading(false)
        }
    }

    // this will filter the reminders array using the "sent" property on each reminder obj
    const filteredReminders = useMemo(() => {
        if(showUpcomingReminders){
            return reminders.filter(reminder => reminder.sent === false)
           } else {
            return reminders.filter(reminder => reminder.sent === true)
           }
    }, [reminders, showUpcomingReminders])

    const handleDeleteReminder = async (reminderId: string) => {
        try{
            // grab access token
            const session = await fetchAuthSession()
            const accessToken = session.tokens?.accessToken?.toString()

            // if check for no token
            if (!accessToken){
                console.error('No access token found')
                return
            }

            // call delete function from our front end api folder
            const result = await deleteReminder(reminderId, accessToken)
            if(!result.success){
                throw new Error('Error deleting reminder')
            }

            // here we update the reminders in our component by filtering the array
            setReminders(reminders => 
                reminders.filter(reminder => reminder.reminderId !== reminderId)
            )

            // set the string back to null
            setRemovingItem(null)
        } catch (err) {
            console.error('Could not delete reminder:', err)
        }
    }

    

    

    return(
        <>
            <h1 className="inter-bold text-4xl text-green-400 text-center mt-8">Your Reminders</h1>
            <div className="h-max p-4 bg-green-400 rounded-lg mx-auto mt-8 w-9/10">
                    { loading ? (
                        // if we are loading we display this message :)
                        <p>Loading Reminders...</p>
                    ) : reminders.length === 0 ? (
                        // if we have finished loading but there no reminders...
                        <p>No reminders found!</p>
                    ) : (
                        // if we've finished loading and there ARE reminders...
                        <div className="w-full">{
                            filteredReminders.map((reminder) => (
                                <div className="bg-gray-200 rounded-lg p-2 my-4"
                                key={reminder.reminderId}>
                                    {removingItem !== reminder.reminderId ? (   
                                        <>
                                            <h4 className="font-bold">{reminder.title}</h4>
                                            <p className="italic my-2">{reminder.description}</p>
                                            <div className="flex justify-between">
                                                <p>{
                                                    // this converts the reminder time into a string with Canadian date formatting 
                                                    new Date(reminder.reminder_time).toLocaleString()
                                                }</p>
                                                <button className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max"
                                                onClick={() => {
                                                    setRemovingItem(reminder.reminderId)
                                                }}
                                                >Remove</button>
                                            </div>
                                        </> 
                                            ) : (
                                                <div>
                                                    <h4 className="font-bold">{reminder.title}</h4>
                                                    <p>Are you sure you want to remove this reminder?</p>
                                                    <div className="flex justify-end">
                                                        <button className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max mx-2"
                                                        onClick={() => {
                                                            setRemovingItem(null)
                                                        }}>No</button>
                                                        <button className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max mx-2"
                                                        onClick={() => {
                                                            handleDeleteReminder(reminder.reminderId)
                                                        }}>Yes</button>
                                                    </div>
                                                </div>
                                            ) 
                                    }
                                </div>
                            ))
                        }
                        </div>
                    )}
                <div className="flex justify-between">
                    <button 
                    onClick={() => {
                        setViewRemindersOpen(false)
                    }}
                    className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max">Go Back</button>
                    <button 
                    onClick={() => {
                        setShowUpcomingReminders(prev => !prev)
                        // filterReminders()
                    }}
                    className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max">{showUpcomingReminders ? 'View sent reminders' : 'View upcoming reminders'}</button>
                </div>
            </div>
        </>
    )
}