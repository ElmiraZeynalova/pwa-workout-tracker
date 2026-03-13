import { useEffect} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Home from './components/Home'
import Calendar from './components/Calendar'
import SignIn from './components/SignIn'
import LogWorkout from './components/LogWorkout'
import AddExercise from './components/AddExercise'
import {useForceRerenderStore} from "./store/force-rerender-store"
import { supabase, syncPendingWorkouts, syncIDBWithServer} from './supabaseDB'
import {useUserStore} from './store/user-store'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)
  const forceRerender = useForceRerenderStore(state => state.setForceRerender)

useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
        if (session) {
            setUserId(session.user.id)
        }
    })

    const syncFromServer = async() => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        console.log("Syncing from server...")
        await syncIDBWithServer(session.user.id)
        forceRerender()
        console.log("Synced")
      }
      catch (err) {
        console.error("Error syncing from server:", err)
      }
    }

    syncFromServer()

    const handler = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      console.log("Syncing pending workouts...")
      await syncPendingWorkouts()
      console.log("Synced pending")
      console.log("Syncing from server...")
      await syncIDBWithServer(session.user.id)
      forceRerender()
      console.log("Synced")
    }

    window.addEventListener("online", handler)

    return () => {
        authListener?.subscription.unsubscribe()
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
