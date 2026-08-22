import {ROUTES} from './constants'
import { createBrowserRouter} from 'react-router-dom'
import HomePage from '../pages/HomePage/HomePage'
import DesktopHomePage from '../pages/desktop/HomePage/HomePage'
import CalendarPage from '../pages/CalendarPage/CalendarPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import LogWorkoutPage from '../pages/LogWorkoutPage/LogWorkoutPage'
import ExercisesListPage from '../pages/ExerciseListPage/ExercisesListPage'
import CreateRoutinePage from '../pages/CreateRoutinePage/CreateRoutinePage'
import DesktopRoutinesPage from '../pages/desktop/RoutinesPage/RoutinesPage'
import DesktopCreateRoutinePage from '../pages/desktop/CreateRoutinePage/CreateRoutinePage'
import DesktopEditPage from '../pages/desktop/EditPage/EditPage'
import LandingPage from '../pages/LandingPage/LandingPage'
import {useMediaQuery} from '../hooks/useMediaQuery'
import EditPage from '../pages/EditPage/EditPage'
import ProtectedRoute from '../components/ProtectedRoute'

export function getRouter(){
    const isDesktop = useMediaQuery('(min-width: 1024px)')

    return createBrowserRouter([
        {
            path: ROUTES.LANDING,
            element: <LandingPage />
        },
        {
            path: ROUTES.LOGIN,
            element: <LoginPage />
        },
        {
            path: ROUTES.HOME,
            element: isDesktop ? <ProtectedRoute><DesktopHomePage/></ProtectedRoute> : <ProtectedRoute><HomePage/></ProtectedRoute>
        },
        {
            path: ROUTES.CALENDAR,
            element: <ProtectedRoute><CalendarPage /></ProtectedRoute>
        },
        {
            path: ROUTES.WORKOUTS_NEW,
            element: <ProtectedRoute><LogWorkoutPage /> </ProtectedRoute>
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
            element: isDesktop ? <ProtectedRoute><DesktopEditPage/></ProtectedRoute> : <ProtectedRoute><EditPage/></ProtectedRoute>
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
}