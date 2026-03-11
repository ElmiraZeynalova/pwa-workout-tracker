import { createClient } from '@supabase/supabase-js'
import { getWorkoutByDate, getAllStoreData, deleteWorkoutByDate } from "./indexedDB"
import { useUserStore } from "./store/user-store"

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
    const workoutId = crypto.randomUUID()

    const { error: workoutError } = await supabase
        .from('workouts')
        .insert([
            { id: workoutId, user_id: userId, date: date }
        ])
    if(workoutError) return { error: workoutError }

    const {error: exerciseError} = await supabase
        .from('exercises')
        .insert(
            exercises.map(e => (
                { id: e.exerciseId, name: e.exerciseName, workout_id: workoutId }
            ))
        )
    if(exerciseError) return { error: exerciseError }

    const {error: setError} = await supabase
        .from('sets')
        .insert(
            exercises.flatMap(e => (
                e.sets.map(set => (
                    { id: crypto.randomUUID(), exercise_id: e.exerciseId, reps: set.reps, weight: set.weight }
                ))
            ))
        )
    if(setError) return { error: setError }
    return { error: null }
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
