import { create } from 'zustand'

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

type Workout = {
    date: string
    exercises: Exercise[]
}

type RenderWorkoutStore = {
    workouts: Record<string, Workout>
    setWorkout: (date: string, exercises: Exercise[]) => void
    removeWorkout: (date: string) => void
    setMany: (workouts: Workout[]) => void
}

export const useRenderWorkoutOnScreenStore = create<RenderWorkoutStore>((set) => ({
    workouts: {},
    setWorkout: (date, exercises) =>
        set(state => ({
            workouts: {...state.workouts, [date]: {date, exercises}}
        })),
    removeWorkout: (date) =>
        set(state => {
            const copy = { ...state.workouts }
            delete copy[date]
            return { workouts: copy }
        }),
    setMany: (workouts) =>
        set(() => ({
            workouts: Object.fromEntries(
                workouts.map(w => [w.date, w])
            )
        }))

}))