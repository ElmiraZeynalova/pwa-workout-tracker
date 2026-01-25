import type {Exercise} from './store'

type Workout = {
    date: string,
    exercises: Exercise[]
}

const DB_NAME = 'workout_tracker'
const DB_VERSION = 1
const STORE_NAME = "workouts"

function openDB(): Promise<IDBDatabase>{
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = (event: any) => {
            const db = event.target.result
            if(!db.objectStoreNames.contains(STORE_NAME)){
                db.createObjectStore(STORE_NAME, {keyPath: "date"})
            }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)

    })
}
export async function saveWorkout(date: string, exercises: Exercise[]){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        store.put({date, exercises})

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)

        
    })
}

export async function getWorkoutByDate(date: string): Promise<Workout | undefined>{
    const db = await openDB()

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(date)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}


