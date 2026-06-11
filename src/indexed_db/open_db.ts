const DB_NAME = 'workout_tracker'
const DB_VERSION = 2
const STORE_NAMES = ["workouts", "routines"]

export async function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result

            for(const storeName of STORE_NAMES){
                if (!db.objectStoreNames.contains(storeName)) {
                    storeName === "routines" ? db.createObjectStore(storeName, { keyPath: "routineId" }) : db.createObjectStore(storeName, { keyPath: "date" })
                }
            }

        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}
