import { Header } from "./components/Header"
import { AuthPanel } from "./components/AuthPanel"
import { useEffect, useState } from "react"
import { useAuth } from "./components/contexts/useAuth"
import { VerifyPhone } from "./components/VerifyPhone"
import { OptionsPanel } from "./components/OptionsPanel"
import { ReminderInput } from "./components/ReminderInput"
import { ViewReminders } from "./components/ViewReminders"


function App() {

  const [authPanelOpen, setAuthPanelOpen] = useState(false)
  const [loggingIn, setLoggingIn] = useState(true)
  const [registering, setRegistering] = useState(false)
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [reminderInputOpen, setReminderInputOpen] = useState(false)
  const [viewRemindersOpen, setViewRemindersOpen] = useState(false)

  useEffect(() => {

  })

  return (
        user ? (
          <>
            <VerifyPhone 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            />
            <OptionsPanel 
            reminderInputOpen={reminderInputOpen}
            viewRemindersOpen={viewRemindersOpen}
            setReminderInputOpen={setReminderInputOpen}
            setViewRemindersOpen={setViewRemindersOpen}
            />
            {reminderInputOpen && 
              <ReminderInput 
              setReminderInputOpen={setReminderInputOpen}/>}
            {viewRemindersOpen && 
              <ViewReminders 
              setViewRemindersOpen={setViewRemindersOpen}/>}
          </>
         ) : (
        <>
          {!authPanelOpen && <Header setAuthPanelOpen={setAuthPanelOpen}/>}
          {authPanelOpen && <AuthPanel setAuthPanelOpen={setAuthPanelOpen}
          loggingIn={loggingIn}
          setLoggingIn={setLoggingIn}
          registering={registering}
          setRegistering={setRegistering}/>}
        </>
         )
  )
}

export default App
