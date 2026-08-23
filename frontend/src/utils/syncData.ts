import { getAllWorkouts, createOrUpdateWorkout, getWorkoutExercises } from "../api/workouts";
import { saveWorkout, getUnsyncedWorkouts, getWorkoutByDate, markWorkoutSynced, deleteWorkoutByDate, getAllWorkouts as getAllWorkoutsFromIDB, clearWorkoutsStoreMemory} from "./indexed_db/workouts-store-crud";
import { useRenderDataOnScreenStore } from "../store/render-data-store";
import { getAllRoutines, createOrUpdateRoutine, getRoutineExercises } from "../api/routines";
import { saveRoutine, getUnsyncedRoutines, markRoutineSynced, deleteRoutineById, getAllRoutines as getAllRoutinesFromIDB, clearRoutinesStoreMemory, getRoutineById } from "./indexed_db/routines-store-crud";
import type { DB_Workout, IDB_Routine, DB_Routine, IDB_Workout, DB_Exercise, Exercise, DB_Set } from "../types";

async function syncWorkouts(){
    const removeWorkout = useRenderDataOnScreenStore.getState().removeWorkout
    const setWorkout = useRenderDataOnScreenStore.getState().setWorkout
    const unsyncedWorkouts = await getUnsyncedWorkouts()
    if(unsyncedWorkouts.length > 0){
        for(const workout of unsyncedWorkouts){
            await createOrUpdateWorkout(workout.workoutId, workout.date, workout.exercises)
            await markWorkoutSynced(workout.date)
        }
    }

    const allWorkoutsFromServer = await getAllWorkouts()

    if(allWorkoutsFromServer.length === 0){
        await clearWorkoutsStoreMemory()
        useRenderDataOnScreenStore.getState().setAllWorkouts([])
        return
    }

    const serverDates = new Set(allWorkoutsFromServer.map((w: DB_Workout) => w.date))
    const localWorkouts: IDB_Workout[] = await getAllWorkoutsFromIDB()
    
    for (const local of localWorkouts) {
        if (!serverDates.has(local.date) && local.isSynced === 1) {
            await deleteWorkoutByDate(local.date)
            removeWorkout(local.date)
        }
    }

    for(const w of allWorkoutsFromServer){
        const localWorkout = await getWorkoutByDate(w.date)
        if(!localWorkout || (localWorkout.isSynced === 1 && w.updated_at > localWorkout.updated_at)){
            if(localWorkout) await deleteWorkoutByDate(w.date)
            const exercisesFromDB = await getWorkoutExercises(w.id)
            const exercisesToSave: Exercise[] = exercisesFromDB.map((e: DB_Exercise) => (
                {"exerciseId": e.id, "name": e.name, "sets": e.sets.map((s: DB_Set) => ({"setId": s.id, "reps": s.reps, "weight": s.weight}))}
            ))

            await saveWorkout(w.date, w.id, exercisesToSave, 1)
            setWorkout(w.date, exercisesToSave)
        }
    }
}


async function syncRoutines(){
    const removeRoutine = useRenderDataOnScreenStore.getState().removeRoutine
    const setRoutine = useRenderDataOnScreenStore.getState().setRoutine
    const unsyncedRoutines = await getUnsyncedRoutines()
    if(unsyncedRoutines.length > 0){
        for(const routine of unsyncedRoutines){
            await createOrUpdateRoutine(routine.routineId, routine.title, routine.exercises)
            await markRoutineSynced(routine.routineId)
        }
    }

    const allRoutinesFromServer = await getAllRoutines()

    if(allRoutinesFromServer.length === 0){
        await clearRoutinesStoreMemory()
        useRenderDataOnScreenStore.getState().setAllRoutines([])
        return
    }

    const serverData = new Set(allRoutinesFromServer.map((r: DB_Routine) => r.id))
    const localRoutines: IDB_Routine[] = await getAllRoutinesFromIDB()
    
    for (const local of localRoutines) {
        if (!serverData.has(local.routineId) && local.isSynced === 1) {
            await deleteRoutineById(local.routineId)
            removeRoutine(local.routineId)
        }
    }

    for(const r of allRoutinesFromServer){
        const localRoutine = await getRoutineById(r.id)
        if(!localRoutine || (localRoutine.isSynced === 1 && r.updated_at > localRoutine.updated_at)){
            if(localRoutine) await deleteRoutineById(r.id)
            const exercisesFromDB = await getRoutineExercises(r.id)
            const exercisesToSave: Exercise[] = exercisesFromDB.map((e: DB_Exercise) => (
                {"exerciseId": e.id, "name": e.name, "sets": e.sets.map((s: DB_Set) => ({"setId": s.id, "reps": s.reps, "weight": s.weight}))}
            ))
            await saveRoutine(r.id, r.title, exercisesToSave, 1)
            setRoutine(r.id, r.title, exercisesToSave)
        }
    }
}

export async function syncData(){
    try{
        await syncWorkouts()
        await syncRoutines()
        console.log("Successful sync!")
    }catch(error){
        console.error(error)
    }

}