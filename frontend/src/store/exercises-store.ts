import { create } from 'zustand'

type Set = {
    setId: string
    reps: number 
    weight: number 
    checked?: boolean
}

type Exercise = {
    exerciseId: string
    name: string 
    sets: Set[]
}

type ExercisesStore = {
    exercises: Exercise[]
    routineTitle: string
    setRoutineTitle: (title: string) => void
    addNewExercises: (newExercisesNames: string[]) => void
    addNewFullExercises: (newExercises: Exercise[]) => void
    deleteExercise: (exerciseId: string) => void
    addNewSet: (exerciseId: string) => void
    deleteSet: (exerciseId: string, setId: string) => void
    updateSet: (exerciseId: string, setId: string, fieldName: "reps" | "weight", value: number | null) => void
    toggleChecked: (exerciseId: string, setId: string) => void
    clearStore: () => void
}

export const useExercisesStore = create<ExercisesStore>((set) => ({
    exercises: [],
    routineTitle: "",
    setRoutineTitle: (title) => 
        set({routineTitle: title}),
    addNewExercises: (newExercisesNames) => 
        set(state => ({
            exercises: [...state.exercises, 
                ...newExercisesNames.map(newName => (
                {exerciseId: crypto.randomUUID(), name: newName, sets: [{setId: crypto.randomUUID(), reps: 0, weight: 0, checked: false}]}
                ))
            ]
        })),
    addNewFullExercises: (newExercises) => 
        set(state => ({
            exercises: [...state.exercises, ...newExercises]
        })),
    deleteExercise: (exerciseId) =>
        set(state => ({
            exercises: state.exercises.filter(e => e.exerciseId !== exerciseId)
        })),
    addNewSet: (exerciseId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: [...e.sets, {setId: crypto.randomUUID(), reps:0, weight: 0, checked: false}]}
                    : e
            )
        })),

    deleteSet: (exerciseId, setId) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {...e, sets: e.sets.filter(s => s.setId !== setId)}
                    : e
            )
        })),

    updateSet: (exerciseId, setId, fieldName, value) => 
        set(state => ({
            exercises: state.exercises.map(e => 
                e.exerciseId === exerciseId 
                    ? {
                        ...e, 
                        sets: e.sets.map((set) => 
                            set.setId === setId ? {...set, [fieldName]: value} : set
                    )
                }
                    : e
            )
        })),
    toggleChecked: (exerciseId, setId) => 
        set(state => ({
            exercises: state.exercises.map(e =>
                e.exerciseId === exerciseId
                ? {
                    ...e, sets: e.sets.map((set) =>
                    set.setId === setId ? {...set, checked: !set.checked} : set
                )
            }
                : e
            )
        })),
    clearStore: () => 
        set({exercises: [], routineTitle: ''})

}))
