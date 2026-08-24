import {ROUTES} from './constants'
import { createBrowserRouter} from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import {lazy, Suspense} from 'react'
import PageLoader from '../components/PageLoader/PageLoader'
import HomePage from '../pages/HomePage/HomePage'
import DesktopHomePage from '../pages/desktop/HomePage/HomePage'
const CalendarPage = lazy(() => import('../pages/CalendarPage/CalendarPage'))
import LoginPage from '../pages/LoginPage/LoginPage'
const LogWorkoutPage = lazy(() => import('../pages/LogWorkoutPage/LogWorkoutPage'))
const ExercisesListPage = lazy(() => import('../pages/ExerciseListPage/ExercisesListPage'))
const CreateRoutinePage = lazy(() => import('../pages/CreateRoutinePage/CreateRoutinePage'))
const DesktopRoutinesPage = lazy(() => import('../pages/desktop/RoutinesPage/RoutinesPage'))
const DesktopCreateRoutinePage = lazy(() => import('../pages/desktop/CreateRoutinePage/CreateRoutinePage'))
const DesktopEditPage = lazy(() => import('../pages/desktop/EditPage/EditPage'))
import LandingPage from '../pages/LandingPage/LandingPage'
const EditPage = lazy(() => import('../pages/EditPage/EditPage'))

function withSuspense(node: React.ReactNode){
    return <Suspense fallback={<PageLoader/>}>{node}</Suspense>
}
export function getRouter(isDesktop: boolean){

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
            element: <ProtectedRoute>{isDesktop ? <DesktopHomePage/> : <HomePage/>}</ProtectedRoute>
        },
        {
            path: ROUTES.CALENDAR,
            element: <ProtectedRoute>{withSuspense(<CalendarPage />)}</ProtectedRoute>
        },
        {
            path: ROUTES.WORKOUTS_NEW,
            element: <ProtectedRoute>{withSuspense(<LogWorkoutPage />)}</ProtectedRoute>
        },
        {
            path: ROUTES.WORKOUTS_NEW_EXERCISES,
            element: <ProtectedRoute>{withSuspense(<ExercisesListPage/>)}</ProtectedRoute>
        },
        {
            path: ROUTES.EXERCISES_EDIT,
            element: <ProtectedRoute>{withSuspense(<EditPage/>)}</ProtectedRoute>
        },
        {
            path: ROUTES.ROUTINES_EDIT,
            element: <ProtectedRoute>{withSuspense( isDesktop ? <DesktopEditPage/> : <EditPage/>)}</ProtectedRoute>
        },
        {
            path: ROUTES.WORKOUTS_NEW_ROUTINES_NEW,
            element: <ProtectedRoute>{withSuspense(<CreateRoutinePage/>)}</ProtectedRoute>
        },
        {
            path: ROUTES.WORKOUTS_NEW_ROUTINES_NEW_EXERCISES,
            element: <ProtectedRoute>{withSuspense(<ExercisesListPage/>)}</ProtectedRoute>
        },
        {
            path: ROUTES.ROUTINES,
            element: <ProtectedRoute>{withSuspense(<DesktopRoutinesPage/>)}</ProtectedRoute>
        },
        {
            path:ROUTES.ROUTINES_NEW,
            element: <ProtectedRoute>{withSuspense(<DesktopCreateRoutinePage/>)}</ProtectedRoute>
        }
    ])
}