import { create } from 'zustand'

export type SelectedExercise = {
    imageUrl: string
    exerciseName: string 
    muscleGroup: string 
}

type AllSelectedExercisesStore = {
    exercises: SelectedExercise[],
    addNewExercise: (newExercise: SelectedExercise) => void
}

export const useAllChosenExercisesStore = create<AllSelectedExercisesStore>((set) => ({
    exercises: [],
    addNewExercise: (newExercise) => 
        set(state => ({
            exercises: [...state.exercises, newExercise]
        })),
}))