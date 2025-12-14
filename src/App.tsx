//import { useState } from 'react'
import { createBrowserRouter, RouterProvider} from 'react-router'
import Home from './components/Home'
import Workout from './components/Workout'
import Calendar from './components/Calendar'
import Profile from './components/Profile'

function App() {

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/workout",
    element: <Workout/>
  },
  {
    path: "/profile",
    element: <Profile/>
  },
  {
    path: "/calendar",
    element: <Calendar/>
  }
])

  return (
    <RouterProvider router={router}/>
  )
}

export default App
