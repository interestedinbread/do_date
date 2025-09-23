import { useAuth } from "./contexts/useAuth"

type OptionsPanelProps = {
    reminderInputOpen: boolean,
    viewRemindersOpen: boolean,
    setReminderInputOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>,
    verifying: boolean
}

export function OptionsPanel({ reminderInputOpen, 
    viewRemindersOpen, 
    setReminderInputOpen, 
    setViewRemindersOpen,
    verifying }: OptionsPanelProps) {
    
    const { logout } = useAuth()

    if( reminderInputOpen || viewRemindersOpen || verifying ) { return null }
    
    // amplify logout is set up in our auth provider
    const handleLogout = async () => {
        await logout()
    }

    return (
        <div className="w-9/10 h-max p-2 rounded-lg mx-auto bg-indigo-100 shadow-md">
            <h2 className="text-xl inter-bold text-indigo-600 m-4">What would you like to do?</h2>
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <button 
                        className="bg-white px-2 w-max rounded-md text-green-500 shadow-md my-2 ml-2 text-xl"
                        onClick={() => {
                            setReminderInputOpen(true)
                        }}
                        >Create Reminder</button>
                    <button 
                        className="bg-white px-2 w-max rounded-md text-green-500 shadow-md my-2 ml-2" 
                        onClick={() => {
                            setViewRemindersOpen(true)
                        }} 
                        >View My Reminders</button>
                    <button 
                        className="bg-white px-2 w-max rounded-md text-green-500 shadow-md my-2 ml-2"
                        onClick={handleLogout}
                        >Logout</button>
                </div>
                <div>
                    <img src="/img/noun-schedule-256135-4C25E1.png" className="h-[100px] w-[100px] mr-4"/>
                </div>
            </div>
        </div>
    )
}