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
                    placeholder="eg. Get flowers"
                    className="shadow-md bg-white rounded-md pl-2 my-2"
                    />
                <p className="mt-4 inter-bold text-indigo-600">Description</p>
                <p className="italic text-indigo-600">This is the actual content of your reminder</p>
                <textarea 
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                    value={description}
                    placeholder="Pick up tulips for Emily at Charlie's"
                    className="bg-white rounded-md shadow-md pl-2 my-2 w-9/10"
                    />
                <p className="mt-4 inter-bold text-indigo-600">Reminder Time</p>
                <input 
                    value={reminderTime}
                    onChange={(e) => {
                       setReminderTime(e.target.value) 
                    }}
                    type="datetime-local"
                    placeholder="Select date and time"
                    className="shadow-md bg-white rounded-md pl-2 my-2"
                    />
                <div className="flex justify-between">
                    <button 
                    className="bg-indigo-400 px-2 rounded-md text-white w-max shadow-md"
                    type="submit"
                    >
                        Save Reminder
                    </button>
                    <button
                    onClick={() => {
                        setReminderInputOpen(false)
                    }}
                    className="bg-indigo-400 px-2 shadow-md px-2 rounded-md text-white w-max ml-10"
                    >Go Back</button>
                </div>
            </form>
        </div>
        
        </>
    )
}