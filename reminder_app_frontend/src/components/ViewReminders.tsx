
type ViewRemindersProps = {
    setViewRemindersOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ViewReminders ({ setViewRemindersOpen }: ViewRemindersProps) {

    return(
        <div className="w-max h-max p-2 bg-green-400 rounded-lg mx-auto mt-20">
            <p>Reminders will go here</p>
            <button 
            onClick={() => {
                setViewRemindersOpen(false)
            }}
            className="bg-green-400 border-2 border-yellow-300 px-2 rounded-md text-white w-max">Go Back</button>
        </div>
    )
}