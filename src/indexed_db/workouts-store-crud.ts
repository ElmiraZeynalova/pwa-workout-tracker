import {openDB} from './open_db'

type Workout = {
    isSynced: number
    updated_at: string,
    date: string
    exercises: Exercise[]
}
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
const STORE_NAME = "workouts"

export async function saveWorkout(date: string, exercises: Exercise[], status: number){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        
        const request = store.get(date)
        request.onsuccess = () => {
            const data = request.result
            const now = new Date().toISOString()
            const toSave = data 
                ? { 
                    isSynced: status,
                    updated_at: now,
                    date: date, 
                    exercises: [
                        ...data.exercises.filter((e: Exercise) => !exercises.some(ne => ne.exerciseId === e.exerciseId)), 
                        ...exercises
                    ] 
                }
                : { isSynced: status, updated_at: now, date: date, exercises: exercises }
            const putRequest = store.put(toSave)
            putRequest.onerror = () => reject(putRequest.error)
        }
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function editExercise(workoutDate: string, cleanExerciseData: Exercise){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(workoutDate) 

        request.onsuccess = () => {
            const workout = request.result
            
            if (!workout) {
                reject(new Error("Workout not found"))
                return
            }
            const now = new Date().toISOString()
            const updatedExercises = workout.exercises.map((e: Exercise) => (
                e.exerciseId === cleanExerciseData.exerciseId ? {...e, sets: cleanExerciseData.sets} : e
            ))

            store.put({ ...workout, updated_at: now, exercises: updatedExercises })
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function deleteExerciseById(workoutDate: string, exerciseId: string){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(workoutDate) 

        request.onsuccess = () => {
            const workout = request.result
            
            if (!workout) {
                reject(new Error("Workout not found"))
                return
            }
            const now = new Date().toISOString()
            const updated = {
                ...workout,
                updated_at: now,
                exercises: workout.exercises.filter((e: Exercise) => e.exerciseId !== exerciseId)
            }
            store.put(updated)
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function deleteWorkoutByDate(workoutDate: string){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        store.delete(workoutDate)

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function getWorkoutByDate(date: string){
    const db = await openDB()

    return new Promise<Workout>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(date)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function getAllWorkouts(){
    const db = await openDB()

    return new Promise<Workout[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function getExerciseDataByDateAndId(workoutDate: string, exerciseId: string) {
    const db = await openDB()

    return new Promise<Exercise>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(workoutDate) 

        request.onsuccess = () => {
            const workout = request.result
            
            if (!workout) {
                reject(new Error("Workout not found"))
                return
            }

            const exercise = workout.exercises.find((e :Exercise) => e.exerciseId === exerciseId)

            if (!exercise) {
                reject(new Error("Exercise not found"))
                return
            }
            resolve(exercise)
        }

        request.onerror = () => reject(request.error)
    })
}

export async function markWorkoutUnsynced(workoutDate: string){
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(workoutDate) 

        request.onsuccess = () => {
            const workout = request.result
            
            if (!workout) {
                reject(new Error("Workout not found"))
                return
            }

            store.put({ ...workout, isSynced: 0 })
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function markWorkoutSynced(workoutDate: string){
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(workoutDate) 

        request.onsuccess = () => {
            const workout = request.result
            
            if (!workout) {
                reject(new Error("Workout not found"))
                return
            }

            store.put({ ...workout, isSynced: 1 })
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function getUnsyncedWorkouts(){
    const db = await openDB()

    return new Promise<Workout[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll() 

        request.onsuccess = () => {
            const allWorkouts = request.result
            
            if (!allWorkouts) {
                resolve([]) 
                return
            }

            const unsyncedWorkouts = allWorkouts.filter((w: Workout) => w.isSynced === 0)
            resolve(unsyncedWorkouts)
        }

        request.onerror = () => reject(request.error)
    })
}

export async function clearWorkoutsStoreMemory() {
    const db = await openDB()
    
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        store.clear()
        
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}