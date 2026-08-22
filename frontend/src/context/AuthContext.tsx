// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {userIsValid} from "../api/auth"

export type AuthState = "loggedIn" | "guest" | "unauthenticated"

interface AuthContextValue {
  authState: AuthState
  markAsLoggedIn: () => void
  continueAsGuest: () => void
  markAsUnauthenticated: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (localStorage.getItem("isLoggedIn") === "true") return "loggedIn"
    if (localStorage.getItem("isGuest") === "true") return "guest"
    return "unauthenticated"
  })

  useEffect(() => {
    if(authState !== "loggedIn") return

    async function verifySession() {
      const user = await userIsValid()
      if (!user) {
        markAsUnauthenticated()
      }
    }

    verifySession()
  }, [])

  function markAsLoggedIn() {
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("isGuest", "false")
    setAuthState("loggedIn")
  }

  function continueAsGuest() {
    localStorage.setItem("isLoggedIn", "false")
    localStorage.setItem("isGuest", "true")
    setAuthState("guest")
  }

  function markAsUnauthenticated() {
    localStorage.setItem("isLoggedIn", "false")
    localStorage.setItem("isGuest", "false")
    setAuthState("unauthenticated")
  }

  return (
    <AuthContext.Provider value={{ authState, markAsLoggedIn, continueAsGuest, markAsUnauthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthState() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthState must be used within AuthProvider')
  }
  return context
}