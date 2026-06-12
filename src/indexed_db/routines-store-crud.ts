import {openDB} from './open_db'

type Routine = {
    isSynced: number
    updated_at: string
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
            const now = new Date().toISOString()
            const toSave = data 
                ? { 
                    routineId: data.routineId,
                    isSynced: status,
                    updated_at: now,
                    title: title, 
                    exercises: [
                        ...data.exercises.filter((e: Exercise) => !exercises.some(ne => ne.exerciseId === e.exerciseId)), 
                        ...exercises
                    ] 
                }
                : { isSynced: status, updated_at: now, routineId: routineId, title: title, exercises: exercises }
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

export async function deleteRoutineById(routineId: string){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        store.delete(routineId)

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function editRoutine(routineId: string, title: string, exercises: Exercise[]){
    const db = await openDB()

    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        const now = new Date().toISOString()
        store.put({routineId,
                    isSynced: 0,
                    updated_at: now,
                    title, 
                    exercises}) 

        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function markRoutineUnsynced(routineId: string){
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(routineId) 

        request.onsuccess = () => {
            const routine = request.result
            
            if (!routine) {
                reject(new Error("Routine not found"))
                return
            }

            store.put({ ...routine, isSynced: 0 })
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function markRoutineSynced(routineId: string){
    const db = await openDB()
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(routineId) 

        request.onsuccess = () => {
            const routine = request.result
            
            if (!routine) {
                reject(new Error("Routine not found"))
                return
            }

            store.put({ ...routine, isSynced: 1 })
        }
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}


export async function getUnsyncedRoutines(){
    const db = await openDB()

    return new Promise<Routine[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.getAll() 

        request.onsuccess = () => {
            const allRoutines = request.result
            
            if (!allRoutines) {
                resolve([]) 
                return
            }

            const unsyncedRoutines = allRoutines.filter((r: Routine) => r.isSynced === 0)
            resolve(unsyncedRoutines)
        }

        request.onerror = () => reject(request.error)
    })
}

export async function clearRoutinesStoreMemory() {
    const db = await openDB()
    
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite")
        const store = transaction.objectStore(STORE_NAME)
        store.clear()
        
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
    })
}

export async function getRoutineById(routineId: string){
    const db = await openDB()

    return new Promise<Routine>((resolve, reject) => {
        if (!routineId) {  
            reject(new Error('getRoutineById called with undefined id'));
            return;
        }
        const transaction = db.transaction(STORE_NAME, "readonly")
        const store = transaction.objectStore(STORE_NAME)

        const request = store.get(routineId)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}