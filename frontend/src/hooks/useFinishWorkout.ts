import { useExercisesStore } from "../store/exercises-store"
import { useDateStore } from "../store/date-store"
import { useRenderDataOnScreenStore } from "../store/render-data-store"
import { useAuthState } from "../context/AuthContext"
import type { Exercise } from "../types/workout.type"
import { useNavigate } from "react-router-dom"
import {ROUTES} from '../utils/constants'
import { saveWorkout, markWorkoutSynced } from "../utils/indexed_db/workouts-store-crud"
import { createWorkout } from "../api/workouts"

export function useFinishWorkout(){
    const currentWorkoutExercises = useExercisesStore(state => state.exercises)
    const clearExercisesStore = useExercisesStore(state => state.clearStore)
    const currentWorkoutDate = useDateStore(state => state.selectedDate)
    const addExercises = useRenderDataOnScreenStore(state => state.addExercises)
    const {authState} = useAuthState()
    const navigate = useNavigate()

    const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === 0 || s.reps === null))
    const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

    function getCleanedExercises(): Exercise[]{
        return currentWorkoutExercises
              .map(e => ({
                      ...e, sets: e.sets
                          .filter((s): s is typeof s & { reps: number } => s.checked === true && s.reps !== null && s.reps > 0)
                          .map(s => ({
                              setId: s.setId,
                              reps: s.reps,
                              weight: s.weight ?? 0
                          }))
              }))
              .filter(e => e.sets.length > 0)
    }


    async function finishWorkout(){
        const cleanedExercises = getCleanedExercises()
        const workoutId = crypto.randomUUID()

        addExercises(currentWorkoutDate, cleanedExercises)
        navigate(ROUTES.HOME)

        await saveWorkout(currentWorkoutDate, workoutId, cleanedExercises, 0)
        clearExercisesStore()

        if(authState === "loggedIn"){
            await createWorkout(workoutId, currentWorkoutDate, cleanedExercises)
            await markWorkoutSynced(currentWorkoutDate)
        }
    }   

    return {isValid, notValid, finishWorkout, exercisesCount: currentWorkoutExercises.length}
}