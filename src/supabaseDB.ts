import { createClient } from '@supabase/supabase-js'
import { getWorkoutByDate, getAllStoreData, deleteWorkoutByDate, overWrightWorkoutFromServer, clearStoreMemory } from "./indexedDB"
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

    const { data: workout} = await supabase
        .from('workouts')
        .select()
        .eq('date', date)

    const existingWorkoutId = workout?.[0]?.id

    if(workout && workout.length > 0){
        const { data: existingExercises } = await supabase
            .from("exercises")
            .select("id")
            .eq("workout_id", existingWorkoutId)

        const exerciseIds = existingExercises?.map(e => e.id) || []
        
        await supabase
            .from("sets")
            .delete()
            .in("exercise_id", exerciseIds)

        await supabase
            .from("exercises")
            .delete()
            .eq("workout_id", existingWorkoutId)

        await supabase
            .from('workouts')
            .delete()
            .eq('date', date)   
    }

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


export async function syncIdbWithServer(userId: string){
    const { data: workouts} = await supabase
        .from('workouts')
        .select("*")
        .eq('user_id', userId)
    
    if(workouts && workouts.length === 0){
        await clearStoreMemory("workouts")
        return
    }
    if(!workouts) return
    for(const workout of workouts){
        const { data: exercises} = await supabase
            .from('exercises')
            .select("*")
            .eq('workout_id', workout.id)
        const exercisesList = []
        if(!exercises) return 
        for(const exercise of exercises){
            const { data: sets} = await supabase
                .from('sets')
                .select("*")
                .eq('exercise_id', exercise.id)
            if(!sets) return 
            exercisesList.push({
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                sets: sets?.map(set => ({reps: set.reps, weight: set.weight}))
            })
        }
        overWrightWorkoutFromServer("workouts", workout.date, exercisesList)
    }

}
