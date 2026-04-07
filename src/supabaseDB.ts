import { createClient } from '@supabase/supabase-js'
import { useUserStore } from './zustand_store/user-store'
import {getUnsyncedWorkouts, markWorkoutSynced, clearStoreMemory, saveWorkout} from './indexed_db/crud'

type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export async function signInUser(email: string){
    const { error } = await supabase.auth.signInWithOtp({ email: email })
    return { error }
}

export async function verifyOtp(email: string, code: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code, 
        type: 'email'
    })

    return { data, error }
}

export async function syncWorkouts(){
    const userId = useUserStore.getState().userId
    const workoutsData = await getUnsyncedWorkouts()
    if(!workoutsData) return 

    for(const w of workoutsData){
        if(w.exercises.length === 0){
            const {data: workoutData} = await supabase
                .from('workouts')
                .select('id')
                .eq('date', w.date)
                .eq('user_id', userId)
                .single()
            const workoutId = workoutData?.id
            const {data: exercises} = await supabase
                .from('exercises')
                .select('id')
                .eq('workout_id', workoutId)

            const exerciseIds = exercises?.map(e => e.id) || []

            if(exerciseIds && exerciseIds.length > 0){
                await supabase.from('sets').delete().in('exercise_id', exerciseIds)
                await supabase.from('exercises').delete().in('id', exerciseIds)
            }

            if(workoutId){
                await supabase.from('workouts').delete().eq('id', workoutId)
            }
            await markWorkoutSynced(w.date)
            continue
        }
        const { data: workout, error: upsertWorkoutError } = await supabase
            .from('workouts')
            .upsert(
                { user_id: userId, date: w.date },
                { onConflict: 'user_id,date' }
            )
            .select()
            .single()

        if(upsertWorkoutError) return { error: upsertWorkoutError}
        const workoutId = workout.id

        const {data: exercises, error: getExerciseError} = await supabase
            .from('exercises')
            .select()
            .eq('workout_id', workoutId)

        if(getExerciseError) return { error: getExerciseError }
        const exerciseIds = exercises.map(e => e.id) || []

        const {error: deleteSetsError} = await supabase
            .from('sets')
            .delete()
            .in('exercise_id', exerciseIds)
        if(deleteSetsError) return { error: deleteSetsError }

        const {error: deleteExercisesError} = await supabase
            .from('exercises')
            .delete()
            .eq('workout_id', workoutId)

        if(deleteExercisesError) return { error: deleteExercisesError }

        const {error: insertExercisesError} = await supabase
            .from('exercises')
            .insert(
                w.exercises.map(e => (
                    {id: e.exerciseId, name: e.exerciseName, workout_id: workoutId}
                ))
            )
        if(insertExercisesError) return { error: insertExercisesError}

        const {error: insertSetsError} = await supabase
            .from('sets')
            .insert(
                w.exercises.flatMap(e => 
                    e.sets.map(s => (
                        {id: s.setId, exercise_id: e.exerciseId, reps: s.reps, weight: s.weight}
                    )
                ))
            )
        if(insertSetsError) return { error: insertSetsError}

        await markWorkoutSynced(w.date)
    }
    return {error: null}
}

export async function syncIDBWithServer(){
    const userId = useUserStore.getState().userId
    const {data: workoutData, error: workoutError} = await supabase
        .from('workouts')
        .select()
        .eq('user_id', userId)
    if(workoutError) return { error: workoutError }
    await clearStoreMemory()

    for(const w of workoutData){
        const {data: exercises} = await supabase
            .from('exercises')
            .select()
            .eq('workout_id', w.workoutId)

        const exerciseIds = exercises?.map(e => e.id) || []
        const {data: sets} = await supabase
            .from('sets')
            .select()
            .in('exercise_id', exerciseIds)
        
        const exercisesList: Exercise[] = exercises?.map(e => ({
            exerciseId: e.id, 
            exerciseName: e.name, 
            sets: sets?.filter(s => s.exercise_id === e.id) || []
        })) || []
        await saveWorkout(w.date, exercisesList, 1)
    }
}

