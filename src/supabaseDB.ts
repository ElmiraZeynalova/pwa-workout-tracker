import { createClient } from '@supabase/supabase-js'
import { useUserStore } from './zustand_store/user-store'
import {getUnsyncedWorkouts, markWorkoutSynced, clearStoreMemory, saveWorkout, getWorkoutByDate, deleteWorkoutByDate, getAllWorkouts} from './indexed_db/crud'
import {useRenderWorkoutOnScreenStore} from './zustand_store/render-workout-store'

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

export async function syncServerWithIDB(){
    const userId = useUserStore.getState().userId
    const workoutsData = await getUnsyncedWorkouts()
    if(workoutsData.length === 0) return 

    for(const w of workoutsData){
        try {
            const { data: workoutData, error: workoutError } = await supabase
                .from('workouts')
                .upsert(
                    { user_id: userId, date: w.date, updated_at: w.updated_at },
                    { onConflict: 'user_id,date' }
                )
                .select('id')
                .single()

            if(workoutError) throw workoutError
            const workoutId = workoutData.id

            await supabase
                .from('exercises')
                .delete()
                .eq('workout_id', workoutId)

            if(w.exercises.length === 0){
                await supabase
                    .from('workouts')
                    .delete()
                    .eq('id', workoutId)
                    
                await markWorkoutSynced(w.date)
                continue
            }

            for(const e of w.exercises){
                const { data: exerciseData, error: exerciseError } = await supabase
                    .from('exercises')
                    .insert({ id: e.exerciseId, name: e.exerciseName, workout_id: workoutId })
                    .select('id')
                    .single()

                if(exerciseError) throw exerciseError
                const exerciseId = exerciseData.id

                if(e.sets.length > 0){
                    const { error: setsError } = await supabase
                        .from('sets')
                        .insert(
                            e.sets.map(s => ({ id: s.setId, reps: s.reps, weight: s.weight, exercise_id: exerciseId }))
                        )
                    if(setsError) throw setsError
                }
            }

            await markWorkoutSynced(w.date)

        } catch(error) {
            console.error(`Failed to sync workout ${w.date}:`, error)
        }
    }
}

export async function syncIDBWithServer(){
    const userId = useUserStore.getState().userId
    const removeWorkout = useRenderWorkoutOnScreenStore.getState().removeWorkout
    const setWorkout = useRenderWorkoutOnScreenStore.getState().setWorkout
    const {data: workoutsData, error: workoutError} = await supabase
        .from('workouts')
        .select()
        .eq('user_id', userId)
    if(workoutError) return { error: workoutError }
    
    if(workoutsData.length === 0){
        await clearStoreMemory()
        useRenderWorkoutOnScreenStore.getState().setMany([])
        return
    } 

    const serverDates = new Set(workoutsData.map(w => w.date))
    const localWorkouts = await getAllWorkouts()

    for (const local of localWorkouts) {
        if (!serverDates.has(local.date) && local.isSynced === 1) {
            await deleteWorkoutByDate(local.date)
            removeWorkout(local.date)
        }
    }

    for(const w of workoutsData){
        const localWorkout = await getWorkoutByDate(w.date)
        if(!localWorkout || (localWorkout.isSynced === 1 && w.updated_at > localWorkout.updated_at)){
            try {
                if(localWorkout) await deleteWorkoutByDate(w.date)
                const exercisesToSave = await getExercisesData(w.id)
                await saveWorkout(w.date, exercisesToSave, 1)
                setWorkout(w.date, exercisesToSave)

            } catch(error) {
                console.error('Failed to fetch exercises:', error)
            }
        }
    }

}

async function getExercisesData(workoutId: string): Promise<Exercise[]> {
    const exercises: Exercise[] = []

    const {data: exercisesData, error: exerciseError} = await supabase
        .from('exercises')
        .select()
        .eq('workout_id', workoutId)
    if(exerciseError) throw exerciseError  

    for(const e of exercisesData){
        const {data: setsData} = await supabase
            .from('sets')
            .select()
            .eq('exercise_id', e.id)
        const sets: SetInfo[] = setsData?.map(set => ({setId: set.id, reps: set.reps, weight: set.weight})) ?? []
        exercises.push({ exerciseId: e.id, exerciseName: e.name, sets })
    }
    return exercises
}