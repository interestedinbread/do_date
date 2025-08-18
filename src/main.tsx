import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@aws-amplify/ui-react/styles.css'
import './index.css'
import App from './App.tsx'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports.ts'
import { AuthProvider } from "./components/contexts/AuthProvider"


Amplify.configure(awsconfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
