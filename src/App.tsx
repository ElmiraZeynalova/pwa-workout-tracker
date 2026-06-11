import { useEffect, useRef, useCallback} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import DesktopHomePage from './pages/desktop/HomePage/HomePage'
import CalendarPage from './pages/CalendarPage/CalendarPage'
import LoginPage from './pages/LoginPage/LoginPage'
import LogWorkoutPage from './pages/LogWorkoutPage/LogWorkoutPage'
import ExercisesListPage from './pages/ExerciseListPage/ExercisesListPage'
import CreateRoutinePage from './pages/CreateRoutinePage/CreateRoutinePage'
import { supabase, syncServerWithIDB, syncIDBWithServer } from './supabase/supabaseDB'
import {getAllWorkouts} from './indexed_db/workouts-store-crud'
import {useUserStore} from './store/user-store'
import EditPage from './pages/EditPage/EditPage'
import {useRenderDataOnScreenStore} from './store/render-data-store'
import {useMediaQuery} from './hooks/useMediaQuery'
import {getAllRoutines} from './indexed_db/routines-store-crud'

function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const setAllWorkouts = useRenderDataOnScreenStore((state) => state.setAllWorkouts)
  const setAllRoutines = useRenderDataOnScreenStore((state) => state.setAllRoutines)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const homeScreen = isDesktop ? <DesktopHomePage /> : <HomePage />

  const init = useCallback(async () => {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
          const workouts = await getAllWorkouts()
          const routines = await getAllRoutines()
          setAllWorkouts(workouts)
          setAllRoutines(routines)
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
    element: userId ? homeScreen : <LoginPage/>
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
    element: <EditPage/>
  },
  {
    path: "/routines/edit",
    element: <EditPage/>
  },
  {
    path: "/workouts/new/routines/new",
    element: <CreateRoutinePage/>
  },
  {
    path: "/workouts/new/routines/new/exercises",
    element: <ExercisesListPage/>
  }
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
