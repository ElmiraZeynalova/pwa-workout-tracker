
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {userIsValid} from "../api/auth"
import axios from 'axios'
export type AuthState = "loggedIn" | "guest" | "unauthenticated"

interface AuthContextValue {
  authState: AuthState
  markAsLoggedIn: (accessToken: string) => void
  continueAsGuest: () => void
  markAsUnauthenticated: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    if (localStorage.getItem("accessToken")) return "loggedIn"
    if (localStorage.getItem("isGuest") === "true") return "guest"
    return "unauthenticated"
  })

  useEffect(() => {
    if (!navigator.onLine) {
        return
    }
    if(authState !== "loggedIn") return

    async function verifySession() {
      try{
        await userIsValid()
      }catch(error){
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                markAsUnauthenticated()
            } else {

            }
        }
        }
    }

    verifySession()
  }, [])

  function markAsLoggedIn(accessToken: string) {
    localStorage.setItem("accessToken", accessToken)
    localStorage.removeItem("isGuest")
    setAuthState("loggedIn")
  }

  function continueAsGuest() {
    localStorage.removeItem("accessToken")
    localStorage.setItem("isGuest", "true")
    setAuthState("guest")
  }

  function markAsUnauthenticated() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("isGuest")
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