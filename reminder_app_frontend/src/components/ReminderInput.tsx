import { useState } from "react"
import { addReminder } from "../api/reminderApi"
import { fetchAuthSession } from "aws-amplify/auth"


type ReminderInputProps = {
    setReminderInputOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ReminderInput({ setReminderInputOpen }: ReminderInputProps) {

    // these values will make up the new reminder
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [reminderTime, setReminderTime] = useState('')


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // here get the access token by first fetching the auth session
        const session = await fetchAuthSession()
        const accessToken = session.tokens?.accessToken?.toString()

        // if there is no token we have an error
        if (!accessToken) {
            console.error('No access token available')
            return
        }

        if(!title || !description || !reminderTime){
            alert('Please complete all fields')
        }
    
        // package the reminder data in an object
        const reminderData = {
            title,
            description,
            reminder_time: reminderTime,
            accessToken
        }

        try{
            // pass the reminder to our front end api
            const result = await addReminder(reminderData)
            console.log('Reminder added successfully:', result)
            setTitle('')
            setDescription('')
            setReminderTime('')
        } catch (err) {
            console.error('Failed to add reminder:', err)
        }
    }

    return(
        <>
        <div className="w-9/10 h-max p-2 bg-indigo-100 shadow-md rounded-lg mx-auto mb-8 grid grid-cols-4 gap-4">
            <div className="col-span-3">
                <p className="inter-bold text-indigo-600 text-xl">Create your new reminder</p>
                <p className="italic my-2">Your reminder will be sent to you by text at your chosen time.</p>
            </div>
            <div className="col-span-1">
                <img src="/img/noun-schedule-256135-4C25E1.png"
                className="h-[75px] w-[75px]" />
            </div>
        </div>
        <div className="w-max h-max p-2 bg-indigo-100 shadow-md rounded-lg mx-auto">
            <form 
            onSubmit={handleSubmit}
            className="flex flex-col">
                <p className="inter-bold text-indigo-600">Title</p>
                <input 
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                    placeholder="eg. Pick up Emily"
                    className="shadow-md bg-white rounded-md pl-2 my-2"
                    />
                <p className="mt-4 inter-bold text-indigo-600">Description</p>
                <p className="italic text-indigo-600">This is the actual content of your reminder</p>
                <textarea 
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    value={description}
                    placeholder="Pick up Emily at the airport tonight"
                    className="bg-white rounded-md shadow-md pl-2 my-2 w-9/10"
                    />
                <p className="mt-4 inter-bold text-indigo-600">Reminder Time</p>
                <input 
                    value={reminderTime}
                    onChange={(e) => {
                       setReminderTime(e.target.value) 
                    }}
                    // this input type creates a string with the format: YYYY-MM-DDTHH:mm. This is local time.
                    type="datetime-local"
                    placeholder="Select date and time"
                    className="shadow-md bg-white rounded-md pl-2 my-2"
                    />
                <div className="flex justify-between my-2">
                    <button 
                    className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                    type="submit"
                    >
                        Save Reminder
                    </button>
                    <button
                    onClick={() => {
                        setReminderInputOpen(false)
                    }}
                    className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                    >Go Back</button>
                </div>
            </form>
        </div>
        <div className="w-9/10 h-max p-2 bg-indigo-100 shadow-md rounded-lg mx-auto grid grid-cols-4 mt-8">
            <div className="col-span-1">
                <img src="/img/noun-clock-8026515-4C25E1.png" 
                className="h-[75px] w-[75px]"/>
            </div>
            <div className="col-span-3">
                <p className="italic">You can view upcoming reminders and sent reminders from the previous menu.</p>
            </div>
        </div>
        
        </>
    )
}