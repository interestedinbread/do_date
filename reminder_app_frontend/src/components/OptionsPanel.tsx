import { useAuth } from "./contexts/useAuth"

type OptionsPanelProps = {
    reminderInputOpen: boolean,
    viewRemindersOpen: boolean,
    setReminderInputOpen: React.Dispatch<React.SetStateAction<boolean>>
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function OptionsPanel({ reminderInputOpen, 
    viewRemindersOpen, 
    setReminderInputOpen, 
    setViewRemindersOpen }: OptionsPanelProps) {
    
    const { logout } = useAuth()

    if( reminderInputOpen || viewRemindersOpen ) { return null }
    
    // amplify logout is set up in our auth provider
    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="w-max h-max p-2 rounded-lg mx-auto flex flex-col gap-4 bg-indigo-100 shadow-md mt-10">
            <h2 className="text-lg inter-regular text-indigo-600">What would you like to do?</h2>
            <button 
                className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                onClick={() => {
                    setReminderInputOpen(true)
                }}
            >Create Reminder</button>
            <button 
                className="bg-white px-2 rounded-md text-green-500 w-max shadow-md" 
                onClick={() => {
                    setViewRemindersOpen(true)
                }} 
            >View My Reminders</button>
            <button 
                className="bg-white px-2 rounded-md text-green-500 w-max shadow-md"
                onClick={handleLogout}
            >Logout</button>
        </div>
    )
}