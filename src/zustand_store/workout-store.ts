import { create } from 'zustand'

export type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
    checked: boolean
}

export type Exercise = {
    exerciseId: string
    exerciseName: string 
    sets: SetInfo[]
}

type WorkoutStore = {
    exercises: Exercise[],
    addNewExercises: (newExercisesNames: string[]) => void
    deleteExercise: (exerciseId: string) => void
    addNewSet: (exerciseId: string) => void
    deleteSet: (exerciseId: string, setIdx: number) => void
    updateSet: (exerciseId: string, setIdx: number, fieldName: string, value: number) => void
    toggleChecked: (exerciseId: string, setIdx: number) => void
    clearWorkout: () => void
    loadExerciseForEdit: (exercise: Exercise) => void
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    exercises: [],
    addNewExercises: (newExercisesNames) => 
        set(state => ({
            exercises: [...state.exercises, 
                ...newExercisesNames.map(newName => (
                {exerciseId: crypto.randomUUID(), exerciseName: newName, sets: [{setId: crypto.randomUUID(), reps: 5, weight: null, checked: true}]}
                ))
            ]
        })),
    deleteExercise: (exerciseId) =>
        set(state => ({
            exercises: state.exercises.filter(e => e.exerciseId !== exerciseId)
        })),
    addNewSet: (exerciseId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: [...e.sets, {setId: crypto.randomUUID(), reps:5, weight: null, checked: true}]}
                    : e
            )
        })),

    deleteSet: (exerciseId, setIdx) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: e.sets.splice(setIdx, 1)}
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
        })),
    toggleChecked: (exerciseId, setIdx) => 
        set(state => ({
            exercises: state.exercises.map(e =>
                e.exerciseId === exerciseId
                ? {
                    ...e, sets: e.sets.map((set, idx) =>
                    idx === setIdx ? {...set, checked: !set.checked} : set
                )
            }
                : e
            )
        })),
    clearWorkout: () => 
        set({exercises: []}),

    loadExerciseForEdit: (exercise: Exercise) => 
        set(() => ({
            exercises: [exercise]
    }))
    
}))
