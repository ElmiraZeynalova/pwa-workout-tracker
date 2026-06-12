
import { useUserStore } from '../store/user-store'
import {getUnsyncedWorkouts, markWorkoutSynced, clearWorkoutsStoreMemory, saveWorkout, getWorkoutByDate, deleteWorkoutByDate, getAllWorkouts} from '../indexed_db/workouts-store-crud'
import {useRenderDataOnScreenStore} from '../store/render-data-store'
import { getUnsyncedRoutines, markRoutineSynced, clearRoutinesStoreMemory, getAllRoutines, deleteRoutineById, getRoutineById, saveRoutine } from '../indexed_db/routines-store-crud'
import { supabase } from './supabaseClient'
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

async function syncWorkoutsToServer(userId: string){
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

async function syncRoutinesToServer(userId: string){
    const routinesData = await getUnsyncedRoutines()
    if(routinesData.length === 0) return

    for(const r of routinesData){
        try {
            const { error: routineError } = await supabase
                .from('routines')
                .upsert(
                    { id: r.routineId, updated_at: r.updated_at, user_id: userId, title: r.title},
                    { onConflict: 'id' }
                )

            if(routineError) throw routineError
            const routineId = r.routineId

            await supabase
                .from('routine_exercises')
                .delete()
                .eq('routine_id', routineId)

            if(r.exercises.length === 0){
                await supabase
                    .from('routines')
                    .delete()
                    .eq('id', routineId)
                    
                await markRoutineSynced(r.routineId)
                continue
            }

            for(const e of r.exercises){
                const { data: exerciseData, error: exerciseError } = await supabase
                    .from('routine_exercises')
                    .insert({ id: e.exerciseId, name: e.exerciseName, routine_id: routineId})
                    .select('id')
                    .single()

                if(exerciseError) throw exerciseError
                const exerciseId = exerciseData.id

                if(e.sets.length > 0){
                    const { error: setsError } = await supabase
                        .from('routine_sets')
                        .insert(
                            e.sets.map(s => ({ id: s.setId, reps: s.reps, weight: s.weight, routine_exercise_id: exerciseId }))
                        )
                    if(setsError) throw setsError
                }
            }

            await markRoutineSynced(r.routineId)

        } catch(error) {
            console.error(`Failed to sync routine ${r.routineId}:`, error)
        }
    }
}

async function syncWorkoutsToIDB(userId: string){
    const removeWorkout = useRenderDataOnScreenStore.getState().removeWorkout
    const setWorkout = useRenderDataOnScreenStore.getState().setWorkout
    const {data: workoutsData, error: workoutError} = await supabase
        .from('workouts')
        .select()
        .eq('user_id', userId)
    if(workoutError) return { error: workoutError }
    
    if(workoutsData.length === 0){
        await clearWorkoutsStoreMemory()
        useRenderDataOnScreenStore.getState().setAllWorkouts([])
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
                const exercisesToSave = await getWorkoutExercisesData(w.id)
                await saveWorkout(w.date, exercisesToSave, 1)
                setWorkout(w.date, exercisesToSave)

            } catch(error) {
                console.error('Failed to fetch exercises:', error)
            }
        }
    }
}

async function syncRoutinesToIDB(userId: string){
    const removeRoutine = useRenderDataOnScreenStore.getState().removeRoutine
    const setRoutine = useRenderDataOnScreenStore.getState().setRoutine
    const {data: routineData, error: routineError} = await supabase
        .from('routines')
        .select()
        .eq('user_id', userId)
    if(routineError) return { error: routineError }
    
    if(routineData.length === 0){
        await clearRoutinesStoreMemory()
        useRenderDataOnScreenStore.getState().setAllRoutines([])
        return
    } 

    const serverData = new Set(routineData.map(r => r.id))
    const localRoutines = await getAllRoutines()

    for (const local of localRoutines) {
        if (!serverData.has(local.routineId) && local.isSynced === 1) {
            await deleteRoutineById(local.routineId)
            removeRoutine(local.routineId)
        }
    }

    for(const r of routineData){
        if (!r.id) {  
            continue;
        }
        const localRoutine = await getRoutineById(r.id)
        if(!localRoutine || (localRoutine.isSynced === 1 && r.updated_at > localRoutine.updated_at)){
            try {
                if(localRoutine) await deleteRoutineById(r.id)
                const exercisesToSave = await getRoutineExercisesData(r.id)
                await saveRoutine(r.id, r.title, exercisesToSave, 1)
                setRoutine(r.id, r.title, exercisesToSave)

            } catch(error) {
                console.error('Failed to fetch exercises:', error)
            }
        }
    }

}

export async function syncServerWithIDB(){
    const userId = useUserStore.getState().userId
    if(!userId) return
    await syncWorkoutsToServer(userId)
    await syncRoutinesToServer(userId)
}

export async function syncIDBWithServer(){
    const userId = useUserStore.getState().userId
    if(!userId) return
    await syncWorkoutsToIDB(userId)
    await syncRoutinesToIDB(userId)
    
}

async function getWorkoutExercisesData(workoutId: string): Promise<Exercise[]> {
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

async function getRoutineExercisesData(routineId: string): Promise<Exercise[]> {
    const exercises: Exercise[] = []

    const {data: exercisesData, error: exerciseError} = await supabase
        .from('routine_exercises')
        .select()
        .eq('routine_id', routineId)
    if(exerciseError) throw exerciseError  

    for(const e of exercisesData){
        const {data: setsData} = await supabase
            .from('routine_sets')
            .select()
            .eq('routine_exercise_id', e.id)
        const sets: SetInfo[] = setsData?.map(set => ({setId: set.id, reps: set.reps, weight: set.weight})) ?? []
        exercises.push({ exerciseId: e.id, exerciseName: e.name, sets })
    }
    return exercises
}

export async function deleteRoutineFromServer(routineId: string){
    const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', routineId)
    
    if(error) throw error
}