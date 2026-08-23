import { useEffect, useRef} from 'react'
import { RouterProvider} from 'react-router-dom'
import { getRouter } from './utils/getRouter'
import {getAllWorkouts} from "./utils/indexed_db/workouts-store-crud"
import { getAllRoutines } from './utils/indexed_db/routines-store-crud'
import { useAuthState } from "./context/AuthContext"
import { useRenderDataOnScreenStore } from './store/render-data-store'
import { syncData } from './utils/syncData'

function App() {
  const {authState} = useAuthState()

  const setAllWorkouts = useRenderDataOnScreenStore((state) => state.setAllWorkouts)
  const setAllRoutines = useRenderDataOnScreenStore((state) => state.setAllRoutines)

  async function init(){
    const workouts = await getAllWorkouts()
    setAllWorkouts(workouts)
    const routines = await getAllRoutines()
    setAllRoutines(routines)
    if(authState === "loggedIn"){
      await syncData()
    }
  }

  useEffect(() => {
    init()
  }, [])


const router = getRouter()
  return (
    <RouterProvider router={router}/>
  )
}

export default App

