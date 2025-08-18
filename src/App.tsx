import { Header } from "./components/Header"
import { AuthPanel } from "./components/AuthPanel"
import { useState } from "react"
import { useAuth } from "./components/contexts/useAuth"


function App() {

  const [authPanelOpen, setAuthPanelOpen] = useState(false)
  const [loggingIn, setLoggingIn] = useState(true)
  const [registering, setRegistering] = useState(false)
  const { user } = useAuth()

  return (
        user ? (
          <div className="bg-green-400 border-2 border-white rounded-lg p-4 mt-12 w-9/10 mx-auto">
            <h1>Welcome back!</h1>
          </div>
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
