import { createClient } from '@supabase/supabase-js'
import { getWorkoutByDate, getAllStoreData, deleteWorkoutByDate, syncWorkoutWithServer} from "./indexedDB"
import { useUserStore } from "./store/user-store"
import type {Exercise, SetInfo} from './store/workout-store'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export async function signInUser(email: string){
    await supabase.auth.signInWithOtp({ email: email })
}
export async function syncToServer(date: string){
    const exercisesData = await getWorkoutByDate(date)
    const userId = useUserStore.getState().userId
    const exercises = exercisesData!.exercises

    const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .upsert(
            { user_id: userId, date: date },
            { onConflict: 'date'}
        )
        .select()
        .single()

    if(workoutError) return { error: workoutError }
    const workoutId = workout.id

    const {error: exerciseError} = await supabase
        .from('exercises')
        .upsert(
            exercises.map(e => (
                { id: e.exerciseId, name: e.exerciseName, workout_id: workoutId }
            ))
        )
    if(exerciseError) return { error: exerciseError }

    const {error: setError} = await supabase
        .from('sets')
        .upsert(
            exercises.flatMap(e => (
                e.sets.map(set => (
                    { id: set.setId, exercise_id: e.exerciseId, reps: set.reps, weight: set.weight }
                ))
            ))
        )
    if(setError) return { error: setError }
    return {error: null}
}




export async function syncPendingWorkouts(){
    const workouts = await getAllStoreData("pending_sync_to_server")
    for(const workout of workouts){
        try{
            await syncToServer(workout.date)
            await deleteWorkoutByDate("pending_sync_to_server", workout.date)
        }
        catch(e){
            break
        }
    }
}   

export async function syncIDBWithServer(userId: string){
    const { data: workouts} = await supabase
        .from('workouts')
        .select("*")
        .eq('user_id', userId)

    if(!workouts) return
    for(const workout of workouts){
        const { data: exercises} = await supabase
            .from('exercises')
            .select("*")
            .eq('workout_id', workout.id)
        if(!exercises) continue

       const exercisesList: Exercise[] = await Promise.all(
            exercises.map(async e => {
                const { data: sets } = await supabase
                    .from('sets')
                    .select("*")
                    .eq('exercise_id', e.id)
                const setsList: SetInfo[] = sets?.map(s => ({
                    setId: s.id,
                    reps: s.reps,
                    weight: s.weight
                })) || []
                return {
                    exerciseId: e.id,
                    exerciseName: e.name,
                    sets: setsList
                }
            })
        )
        await syncWorkoutWithServer("workouts", workout.date, exercisesList)
    } 
}

