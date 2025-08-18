import { Header } from "./components/Header"
import { AuthPanel } from "./components/AuthPanel"
import { useEffect, useState } from "react"
import { useAuth } from "./components/contexts/useAuth"
import { HomePage } from "./components/HomePage"


function App() {

  const [authPanelOpen, setAuthPanelOpen] = useState(false)
  const [loggingIn, setLoggingIn] = useState(true)
  const [registering, setRegistering] = useState(false)
  const { user } = useAuth()
  const [phoneNumber, setPhoneNumber] = useState(null)

  useEffect(() => {

  })

  return (
        user ? (
          <HomePage 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          />
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
