// import { useEffect, useRef, useCallback} from 'react'
import { RouterProvider} from 'react-router-dom'
import { getRouter } from './utils/getRouter'
// import {syncServerWithIDB, syncIDBWithServer } from './utils/supabase/crud'
// import {supabase} from './utils/supabase/client'
// import {getAllWorkouts} from './utils/indexed_db/workouts-store-crud'
// import {useRenderDataOnScreenStore} from './store/render-data-store'

// import {getAllRoutines} from './utils/indexed_db/routines-store-crud'

// import { useAuthState } from './hooks/useAuthState'
function App() {

  // const setAllWorkouts = useRenderDataOnScreenStore((state) => state.setAllWorkouts)
  // const setAllRoutines = useRenderDataOnScreenStore((state) => state.setAllRoutines)

  // const isSyncing = useRef(false)


  // const init = useCallback(async () => {
  //     if (isSyncing.current) return
  //     isSyncing.current = true
  //     try {
  //         const workouts = await getAllWorkouts()
  //         const routines = await getAllRoutines()
  //         setAllWorkouts(workouts)
  //         setAllRoutines(routines)
  //         await syncServerWithIDB()
  //         await syncIDBWithServer()
  //     } catch (err) {
  //         console.warn("Sync failed", err)
  //     } finally {
  //         isSyncing.current = false
  //     }
  // }, [])

  // useEffect(() => {
  //     const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
  //         if (session) {
  //             setUserId(session.user.id)
  //             init()
  //         }
  //     })

  //     window.addEventListener("online", init)
  //     return () => {
  //         authListener?.subscription.unsubscribe()
  //         window.removeEventListener("online", init)
  //     }
  // }, [init])


const router = getRouter()
  return (
    <RouterProvider router={router}/>
  )
}

export default App

