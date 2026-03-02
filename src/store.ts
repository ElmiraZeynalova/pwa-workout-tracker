import { create } from 'zustand'
import dayjs from 'dayjs'
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
    addNewExercises: (newExercisesNames: string[]) => void
    addNewSet: (exerciseId: string) => void
    updateSet: (exerciseId: string, setIdx: number, fieldName: string, value: string) => void
    clearWorkout: () => void
}

type DateStore = {
    centerDate: string,
    selectedDate: string,
    setCenterDate: (date: string) => void,
    setSelectedDate: (date: string) => void,
    goPrevDay: () => void,
    goNextDay: () => void,
}

export const useDateStore = create<DateStore>((set) => ({
    centerDate:  dayjs().format('YYYY-MM-DD'),
    selectedDate:  dayjs().format('YYYY-MM-DD'),
    setCenterDate: (date) => set({centerDate: date}),
    setSelectedDate: (date) => set({selectedDate: date}),
    goPrevDay: () => 
        set(state => ({
            selectedDate: dayjs(state.selectedDate)
                .subtract(1, 'day')
                .format('YYYY-MM-DD')
        })),
    goNextDay: () => 
        set(state => ({
            selectedDate: dayjs(state.selectedDate)
                .add(1, 'day')
                .format('YYYY-MM-DD')
        })) 
}))

export const useWorkoutStore = create<WorkoutStore>((set) => ({
    exercises: [],
    addNewExercises: (newExercisesNames) => 
        set(state => ({
            exercises: [...state.exercises, 
                ...newExercisesNames.map(newName => (
                    {exerciseId: crypto.randomUUID(), exerciseName: newName, sets: []}
                ))
            ]
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
        })),
    clearWorkout: () => 
        set({exercises: []})
    
}))
