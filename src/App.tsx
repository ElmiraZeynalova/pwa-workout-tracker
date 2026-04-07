import { useEffect, useRef} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './components/HomePage'
import CalendarPage from './components/CalendarPage'
import LoginPage from './components/LoginPage'
import LogWorkoutPage from './components/LogWorkoutPage'
import ExercisesListPage from './components/ExercisesListPage'
import {useForceRerenderStore} from "./zustand_store/force-rerender-store"
import { supabase, syncWorkouts, syncIDBWithServer } from './supabaseDB'
import {useUserStore} from './zustand_store/user-store'
import EditExercisePage from './components/EditExercisePage'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)
  const forceRerender = useForceRerenderStore(state => state.setForceRerender)
  const isSyncing = useRef(false)
  const init = useRef(async () => {
    if (isSyncing.current) return
    isSyncing.current = true
    try {
        await syncWorkouts()
        console.log("Server is synced with IDB")
        await syncIDBWithServer()
        console.log("IDB is synced with Server")
        forceRerender() 
    } catch (err) {
        console.warn("Sync failed, will retry when online", err)
    } finally {
        isSyncing.current = false
    }
  })

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        if (session) {
            setUserId(session.user.id)
            init.current()
        }
    })

    window.addEventListener("online", init.current)
    return () => {
        authListener?.subscription.unsubscribe()
        window.removeEventListener("online", init.current)
    }
}, [])

const router = createBrowserRouter([
  {
    path: "/",
    element: userId ? <HomePage/> : <LoginPage/>
  },
  {
    path: "/calendar",
    element: <CalendarPage/>
  },
  {
    path: "/workouts/new",
    element: <LogWorkoutPage/>
  },
  {
    path: "/workouts/new/exercises",
    element: <ExercisesListPage/>
  },
  {
    path: "/exercises/edit",
    element: <EditExercisePage/>
  }
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
