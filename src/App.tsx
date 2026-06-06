import { useEffect, useRef, useCallback} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import LoginPage from './pages/LoginPage'
import LogWorkoutPage from './pages/LogWorkoutPage'
import ExercisesListPage from './pages/ExercisesListPage'
import { supabase, syncServerWithIDB, syncIDBWithServer } from './supabase/supabaseDB'
import {getAllWorkouts} from './indexed_db/crud'
import {useUserStore} from './store/user-store'
import EditExercisePage from './pages/EditExercisePage'
import {useRenderWorkoutOnScreenStore} from './store/render-workout-store'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const setAllWorkouts = useRenderWorkoutOnScreenStore((state) => state.setAll)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)
  const init = useCallback(async () => {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
          const workouts = await getAllWorkouts()
          setAllWorkouts(workouts)
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
