import { useState, useEffect, useMemo } from "react"
import { getReminders, deleteReminder } from "../api/reminderApi"

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
            // call function imported from our api folder
            const result = await (getReminders())
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
    // runs only when dependencies are updated
    const filteredReminders = useMemo(() => {
        if(showUpcomingReminders){
            return reminders.filter(reminder => reminder.sent === false)
           } else {
            return reminders.filter(reminder => reminder.sent === true)
           }
    }, [reminders, showUpcomingReminders])

    const handleDeleteReminder = async (reminderId: string) => {
        try{
            // call delete function from our front end api folder
            const result = await deleteReminder(reminderId)
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
            <div className="h-max p-4 bg-indigo-100 shadow-md rounded-lg mx-auto w-9/10 grid grid-cols-4">
                <div className="col-span-3">
                    <p className="inter-bold text-indigo-600 text-xl">
                        {showUpcomingReminders ? "Upcoming Reminders" : "Sent Reminders"}
                    </p>
                    <p className="italic mt-2">{showUpcomingReminders ? "Future-you will be proud!" : "Past-you came through!"}</p>
                </div>
                <div className="col-span-1">
                    <img src="/img/noun-schedule-256135-4C25E1.png" className="h-[75px] w-[75px]"/>
                </div>
            </div>
            <div className="h-max p-4 bg-indigo-100 shadow-md rounded-lg mx-auto w-9/10 mt-10">
                    { loading ? (
                        // if we are loading we display this message :)
                        <p className="inter-bold text-indigo-600 my-2">Loading Reminders...</p>
                    ) : reminders.length === 0 ? (
                        // if we have finished loading but there no reminders...
                        <p className="italic mb-4">No reminders found!</p>
                    ) : (
                        // if we've finished loading and there ARE reminders...
                        <div className="w-full">{
                            filteredReminders.map((reminder) => (
                                <div className="bg-gray-300 rounded-lg p-2 my-4 shadow-md"
                                key={reminder.reminderId}>
                                    {removingItem !== reminder.reminderId ? (   
                                        <>
                                            <h4 className="inter-bold text-indigo-600">{reminder.title}</h4>
                                            <p className="italic my-2">{reminder.description}</p>
                                            <div className="flex justify-between">
                                                <p className="inter-bold">{
                                                    // this converts the reminder time into a string with Canadian date formatting 
                                                    new Date(reminder.reminder_time).toLocaleString()
                                                }</p>
                                                <button className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                                                onClick={() => {
                                                    setRemovingItem(reminder.reminderId)
                                                }}
                                                >Remove</button>
                                            </div>
                                        </> 
                                            ) : (
                                                <div>
                                                    <h4 className="inter-bold text-indigo-600">{reminder.title}</h4>
                                                    <p>Are you sure you want to remove this reminder?</p>
                                                    <div className="flex justify-end gap-2">
                                                        <button className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                                                        onClick={() => {
                                                            setRemovingItem(null)
                                                        }}>No</button>
                                                        <button className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
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
                    className="bg-white px-2 rounded-md text-green-500 w-max shadow-md">Go Back</button>
                    <button 
                    onClick={() => {
                        setShowUpcomingReminders(prev => !prev)
                        // filterReminders()
                    }}
                    className="bg-white px-2 rounded-md text-green-500 w-max shadow-md">{showUpcomingReminders ? 'View sent reminders' : 'View upcoming reminders'}</button>
                </div>
            </div>
        </>
    )
}