import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './components/Home'
import Calendar from './components/Calendar'
import SignIn from './components/SignIn'
import LogWorkout from './components/LogWorkout'
import AddExercise from './components/AddExercise'

import { supabase, syncPendingWorkouts } from './supabaseDB'
import {useUserStore} from './store/user-store'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)

useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        if (session) {
            setUserId(session.user.id)
        }
    })

    let syncing = false

    const handler = async () => {
        if (syncing) return
        syncing = true

        try {
            await syncPendingWorkouts()
        } finally {
            syncing = false
        }
    }

    window.addEventListener("online", handler)

    return () => {
        authListener.subscription.unsubscribe()
        window.removeEventListener("online", handler)
    }

}, [])

const router = createBrowserRouter([
  {
    path: "/",
    element: userId ? <Home/> : <SignIn/>
  },
  {
    path: "/calendar",
    element: <Calendar/>
  },
  {
    path: "/workouts/new",
    element: <LogWorkout/>
  },
  {
    path: "/workouts/new/exercises",
    element: <AddExercise/>
  }
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
