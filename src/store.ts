import { create } from 'zustand'

export type SetInfo = {
    reps: string
    weight?: string
}

export type Exercise = {
    exerciseId: string
    exerciseName: string 
    sets: SetInfo[]
}

type WorkoutStore = {
    exercises: Exercise[],
    addNewExercise: (exerciseName: string) => void
    addNewSet: (exerciseId: string) => void
    updateSet: (exerciseId: string, setIdx: number, fieldName: string, value: string) => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    exercises: [],
    addNewExercise: (newExerciseName) => 
        set(state => ({
            exercises: [...state.exercises, {exerciseId: crypto.randomUUID(), exerciseName: newExerciseName, sets: []}]
        })),
    addNewSet: (exerciseId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: [...e.sets, {reps: "0", weight: "0"}]}
                    : e
            )
        })),
    updateSet: (exerciseId, setIdx, fieldName, value) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {
                        ...e, 
                        sets: e.sets.map((set, idx) => 
                            idx === setIdx ? {...set, [fieldName]: value} : set
                    )
                }
                    : e
            )
        })) 
    
}))
