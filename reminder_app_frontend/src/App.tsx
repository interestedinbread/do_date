import { Header } from "./components/Header"
import { AuthPanel } from "./components/AuthPanel"
import { useEffect, useState } from "react"
import { useAuth } from "./components/contexts/useAuth"
import { VerifyPhone } from "./components/VerifyPhone"
import { OptionsPanel } from "./components/OptionsPanel"
import { ReminderInput } from "./components/ReminderInput"
import { ViewReminders } from "./components/ViewReminders"
import { ErrorModal } from "./components/ErrorModal"


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

  const [showError, setShowError] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    console.log('User object:', user)
  }, [user])

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 pt-10">
        {user ? (
          <>
            <VerifyPhone 
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            verifying={verifying}
            setVerifying={setVerifying}
            />
            <OptionsPanel 
            reminderInputOpen={reminderInputOpen}
            viewRemindersOpen={viewRemindersOpen}
            setReminderInputOpen={setReminderInputOpen}
            setViewRemindersOpen={setViewRemindersOpen}
            verifying={verifying}
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
            {authPanelOpen ? (
                    <AuthPanel 
                        setAuthPanelOpen={setAuthPanelOpen}
                        loggingIn={loggingIn}
                        setLoggingIn={setLoggingIn}
                        registering={registering}
                        setRegistering={setRegistering}
                        setShowError={setShowError}
                        setErrorMessage={setErrorMessage}
                    />
                ) : (
                    <Header setAuthPanelOpen={setAuthPanelOpen}/>
                )}
          </>
         )}
         {showError && (
          <ErrorModal 
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            setShowError={setShowError}
            setAuthPanelOpen={setAuthPanelOpen}
            />
         )}
    </div>
  )
}

export default App
