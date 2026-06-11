import {openDB} from './open_db'

type Routine = {
    isSynced: number
    title: string
    routineId: string
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

const STORE_NAME = "routines"

export async function saveRoutine(routineId: string, title: string, exercises: Exercise[], status: number){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        
        const request = store.get(routineId)
        request.onsuccess = () => {
            const data = request.result
            const toSave = data 
                ? { 
                    routineId: data.routineId,
                    isSynced: status,
                    title: title, 
                    exercises: [
                        ...data.exercises.filter((e: Exercise) => !exercises.some(ne => ne.exerciseId === e.exerciseId)), 
                        ...exercises
                    ] 
                }
                : { isSynced: status, routineId: routineId, title: title, exercises: exercises }
            const putRequest = store.put(toSave)
            putRequest.onerror = () => reject(putRequest.error)
        }
        request.onerror = () => reject(request.error)

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function getAllRoutines(){
    const db = await openDB()

    return new Promise<Routine[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll()
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}
