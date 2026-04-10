import { useEffect, useRef, useCallback} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './components/HomePage'
import CalendarPage from './components/CalendarPage'
import LoginPage from './components/LoginPage'
import LogWorkoutPage from './components/LogWorkoutPage'
import ExercisesListPage from './components/ExercisesListPage'
import { supabase, syncServerWithIDB, syncIDBWithServer } from './supabaseDB'
import {getAllWorkouts} from './indexed_db/crud'
import {useUserStore} from './zustand_store/user-store'
import EditExercisePage from './components/EditExercisePage'
import {useRenderWorkoutOnScreenStore} from './zustand_store/render-workout-store'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const setManyWorkouts = useRenderWorkoutOnScreenStore((state) => state.setMany)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)
  const init = useCallback(async () => {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
          const workouts = await getAllWorkouts()
          setManyWorkouts(workouts)
          await syncServerWithIDB()
          await syncIDBWithServer()
      } catch (err) {
          console.warn("Sync failed", err)
      } finally {
          isSyncing.current = false
      }
  }, [])

  useEffect(() => {
      const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
          if (session) {
              setUserId(session.user.id)
              init()
          }
      })

      window.addEventListener("online", init)
      return () => {
          authListener?.subscription.unsubscribe()
          window.removeEventListener("online", init)
      }
  }, [init])

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
