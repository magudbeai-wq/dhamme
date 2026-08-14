import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'
import { App } from './App'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsuZGhhbW1lLnZlcmNlbC5hcHAk'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key in environment variables")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ClerkProvider>
  </StrictMode>,
)

