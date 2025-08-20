import { useAuth } from "./contexts/useAuth"

type OptionsPanelProps = {
    reminderInputOpen: boolean,
    viewRemindersOpen: boolean,
    setReminderInputOpen: React.Dispatch<React.SetStateAction<boolean>>
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function OptionsPanel({ reminderInputOpen, viewRemindersOpen, setReminderInputOpen, setViewRemindersOpen }: OptionsPanelProps) {
    if( reminderInputOpen || viewRemindersOpen ) { return null }
    
    const { logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20 flex flex-col gap-4">
            <h2 className="text-white text-2xl">What would you like to do?</h2>
            <button 
                className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max"
                onClick={() => {
                    setReminderInputOpen(true)
                }}
            >Create Reminder</button>
            <button 
                className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max" 
                onClick={() => {
                    setViewRemindersOpen(true)
                }} 
            >View My Reminders</button>
            <button 
                className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max"
                onClick={handleLogout}
            >Logout</button>
        </div>
    )
}