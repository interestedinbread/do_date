import { Header } from "./components/Header"
import { AuthPanel } from "./components/AuthPanel"
import { useEffect, useState } from "react"
import { useAuth } from "./components/contexts/useAuth"
import { VerifyPhone } from "./components/VerifyPhone"
import { OptionsPanel } from "./components/OptionsPanel"
import { ReminderInput } from "./components/ReminderInput"
import { ViewReminders } from "./components/ViewReminders"
import { Modal } from "./components/Modal"


function App() {

  // this will conditionally render the AuthPanel component
  const [authPanelOpen, setAuthPanelOpen] = useState(false)

  // these will be passed to AuthPanel 
  const [loggingIn, setLoggingIn] = useState(true)
  const [registering, setRegistering] = useState(false)

  // the user object will confirm user authentication
  const { user } = useAuth()

  // these will be passed to VerifyPhone
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // these will be passed to OptionsPanel and will conditionally render components
  const [reminderInputOpen, setReminderInputOpen] = useState(false)
  const [viewRemindersOpen, setViewRemindersOpen] = useState(false)

  // this will be passed to VerifyPhone and OptionsPanel for conditional rendering
  const [verifying, setVerifying] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)

  const [reminders, setReminders] = useState<Reminder[]>([])

  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const [editing, setEditing] = useState(false)
  const [editReminderId, setEditReminderId] = useState('')

  // each reminder returned by the api will have this structure :)
interface Reminder {
  reminderId: string;
  title: string;
  description: string;
  reminder_time: string;
  createdAt: string;
  sent: boolean;
}
  
  useEffect(() => {
    console.log('User object:', user)
  }, [user])

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 pt-16">
        {user ? (
          <>
            <VerifyPhone 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            verifying={verifying}
            setVerifying={setVerifying}
            phoneVerified={phoneVerified}
            setPhoneVerified={setPhoneVerified}
            setShowModal={setShowModal}
            setModalMessage={setModalMessage}
            />
            {phoneVerified && <OptionsPanel 
            reminderInputOpen={reminderInputOpen}
            viewRemindersOpen={viewRemindersOpen}
            setReminderInputOpen={setReminderInputOpen}
            setViewRemindersOpen={setViewRemindersOpen}
            verifying={verifying}
            />}
            {reminderInputOpen && 
              <ReminderInput 
              setReminderInputOpen={setReminderInputOpen}
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}/>}
            {viewRemindersOpen && 
              <ViewReminders 
              setViewRemindersOpen={setViewRemindersOpen}
              reminders={reminders}
              setReminders={setReminders}
              setEditing={setEditing}
              setEditReminderId={setEditReminderId}
              />}
            {editing && 
              <ReminderInput
              setReminderInputOpen={setReminderInputOpen}
              setModalMessage={setModalMessage}
              setShowModal={setShowModal}
              editing={editing}
              setEditing={setEditing}
              editReminderId={editReminderId}
              setEditReminderId={setEditReminderId}
              initialData={{
                title: reminders.find(r => r.reminderId === editReminderId)?.title || '',
                description: reminders.find(r => r.reminderId === editReminderId)?.description || '',
                reminder_time: reminders.find(r => r.reminderId === editReminderId)?.reminder_time || '',
              }}
              onEditComplete={() => {
                setEditing(false)
                setEditReminderId('')
              }}
              />}
          </>
         ) : (
          <>
            {authPanelOpen ? (
                    <AuthPanel 
                        setAuthPanelOpen={setAuthPanelOpen}
                        loggingIn={loggingIn}
                        setLoggingIn={setLoggingIn}
                        registering={registering}
                        setRegistering={setRegistering}
                        setShowModal={setShowModal}
                        setModalMessage={setModalMessage}
                    />
                ) : (
                    <Header setAuthPanelOpen={setAuthPanelOpen}/>
                )}
          </>
         )}
         {showModal && (
          <Modal 
            modalMessage={modalMessage}
            setModalMessage={setModalMessage}
            setShowModal={setShowModal}
            setAuthPanelOpen={setAuthPanelOpen}
            />
         )}
    </div>
  )
}

export default App
