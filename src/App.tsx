import { useEffect, useRef, useCallback} from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import DesktopHomePage from './pages/desktop/HomePage/HomePage'
import CalendarPage from './pages/CalendarPage/CalendarPage'
import LoginPage from './pages/LoginPage/LoginPage'
import LogWorkoutPage from './pages/LogWorkoutPage/LogWorkoutPage'
import ExercisesListPage from './pages/ExerciseListPage/ExercisesListPage'
import CreateRoutinePage from './pages/CreateRoutinePage/CreateRoutinePage'
import DesktopRoutinesPage from './pages/desktop/RoutinesPage/RoutinesPage'
import DesktopCreateRoutinePage from './pages/desktop/CreateRoutinePage/CreateRoutinePage'
import DesktopEditPage from './pages/desktop/EditPage/EditPage'
import LandingPage from './pages/LandingPage/LandingPage'
import {syncServerWithIDB, syncIDBWithServer } from './supabase/supabase_crud'
import {supabase} from './supabase/supabaseClient'
import {getAllWorkouts} from './indexed_db/workouts-store-crud'
import {useUserStore} from './store/user-store'
import EditPage from './pages/EditPage/EditPage'
import {useRenderDataOnScreenStore} from './store/render-data-store'
import {useMediaQuery} from './hooks/useMediaQuery'
import {getAllRoutines} from './indexed_db/routines-store-crud'
import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import {ROUTES} from './routes'
function App() {
  const setUserId = useUserStore((state) => state.setUserId)
  const setAllWorkouts = useRenderDataOnScreenStore((state) => state.setAllWorkouts)
  const setAllRoutines = useRenderDataOnScreenStore((state) => state.setAllRoutines)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const homeScreen = isDesktop ? <DesktopHomePage /> : <HomePage />
  const editScreen = isDesktop ? <DesktopEditPage/> : <EditPage/>

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

  useEffect(() => {
    window.addEventListener('appinstalled', () => {
      localStorage.setItem('isPWA', 'true')
    })
  }, [])

  const isPWA = 
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as any).standalone === true ||
  localStorage.getItem('isPWA') === 'true'

  function ProtectedRoute({ children }: { children: ReactNode }) {
    if (!userId) return <Navigate to={ROUTES.LANDING} replace />
    return children
  }

const router = createBrowserRouter([
  {
    path: ROUTES.LANDING,
    element: userId 
      ? <Navigate to={ROUTES.HOME} replace /> 
      : isPWA 
        ? <Navigate to={ROUTES.LOGIN} replace />
        : <LandingPage />
  },
  {
    path: ROUTES.LOGIN,
    element: userId ? <Navigate to={ROUTES.HOME} replace /> : <LoginPage />
  },
  {
    path: ROUTES.HOME,
    element: <ProtectedRoute>{homeScreen}</ProtectedRoute>
  },
  {
    path: ROUTES.CALENDAR,
    element: <ProtectedRoute><CalendarPage /></ProtectedRoute>
  },
  {
    path: ROUTES.WORKOUTS_NEW,
    element: <ProtectedRoute><LogWorkoutPage /></ProtectedRoute>
  },
  {
    path: ROUTES.WORKOUTS_NEW_EXERCISES,
    element: <ProtectedRoute><ExercisesListPage/></ProtectedRoute>
  },
  {
    path: ROUTES.EXERCISES_EDIT,
    element: <ProtectedRoute><EditPage/></ProtectedRoute>
  },
  {
    path: ROUTES.ROUTINES_EDIT,
    element: <ProtectedRoute>{editScreen}</ProtectedRoute>
  },
  {
    path: ROUTES.WORKOUTS_NEW_ROUTINES_NEW,
    element: <ProtectedRoute><CreateRoutinePage/></ProtectedRoute>
  },
  {
    path: ROUTES.WORKOUTS_NEW_ROUTINES_NEW_EXERCISES,
    element: <ProtectedRoute><ExercisesListPage/></ProtectedRoute>
  },
  {
    path: ROUTES.ROUTINES,
    element: <ProtectedRoute><DesktopRoutinesPage/></ProtectedRoute>
  },
  {
    path:ROUTES.ROUTINES_NEW,
    element: <ProtectedRoute><DesktopCreateRoutinePage/></ProtectedRoute>
  }
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App

