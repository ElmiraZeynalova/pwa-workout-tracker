import { useEffect, useMemo} from 'react'
import { RouterProvider} from 'react-router-dom'
import { getRouter } from './utils/getRouter'
import {getAllWorkouts} from "./idb/workouts-store-crud"
import { getAllRoutines } from './idb/routines-store-crud'
import { useAuthState } from "./context/AuthContext"
import { useRenderDataOnScreenStore } from './store/render-data-store'
import { syncData } from './utils/syncData'
import { useMediaQuery } from './hooks/useMediaQuery'

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
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


const router = useMemo(() => getRouter(isDesktop), [isDesktop])
  return (
    <RouterProvider router={router}/>
  )
}

export default App

