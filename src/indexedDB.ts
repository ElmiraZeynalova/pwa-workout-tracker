import type {Exercise} from './store/workout-store'

type Workout = {
    date: string,
    exercises: Exercise[]
}

const DB_NAME = 'workout_tracker'
const DB_VERSION = 1
const STORES = ["workouts", "pending_sync_to_server"]

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result

            for (const store of STORES) {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store, { keyPath: "date" })
                }
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function saveWorkout(storeName: string, date: string, exercises: Exercise[]){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)
        
        const request = store.get(date)
        request.onsuccess = () => {
            const data = request.result
            const toSave = data 
                ? { 
                    date, 
                    exercises: [
                        ...data.exercises.filter((e: Exercise) => !exercises.some(ne => ne.exerciseId === e.exerciseId)), 
                        ...exercises
                    ] 
                }
                : { date, exercises }
            const putRequest = store.put(toSave)
            putRequest.onerror = () => reject(putRequest.error)
        }
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)

        
    })
}

export async function syncWorkoutWithServer(storeName: string, date: string, exercises: Exercise[]){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)

        const toSave = { date, exercises }
        const putRequest = store.put(toSave)

        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
    
        transaction.onerror = () => reject(transaction.error)
 
    })
}

export async function getWorkoutByDate(date: string): Promise<Workout | undefined>{
    const storeName = "workouts"
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly")
        const store = transaction.objectStore(storeName)

        const request = store.get(date)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function deleteWorkoutByDate(storeName: string, date: string): Promise<void>{
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)

        store.delete(date)
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function getAllStoreData(storeName: string): Promise<Workout[]>{
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly")
        const store = transaction.objectStore(storeName)

        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

export async function clearStoreMemory(storeName: string) {
    const db = await openDB()
    
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite")
        const store = transaction.objectStore(storeName)
        store.clear()
        
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}