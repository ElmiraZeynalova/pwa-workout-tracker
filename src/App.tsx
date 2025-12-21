//import { useState } from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router'
import Home from './components/Home'

import Calendar from './components/Calendar'

import LogWorkout from './components/LogWorkout'
import AddExercise from './components/AddExercise'
function App() {

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
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
