export interface Set {
  setId: string
  reps: number
  weight: number
}

export interface Exercise {
  exerciseId: string
  name: string
  sets: Set[]
}

export interface Workout {
  workoutId: string
  date: string
  exercises: Exercise[]
}

export interface DB_Workout{
  id: string
  user_id: string
  date: string
  updated_at: string
}
export interface DB_Routine{
  id: string
  user_id: string
  title: string
  updated_at: string
}

export interface DB_Set {
  id: string
  exercise_id: string
  reps: number
  weight: number
}

export interface DB_Exercise {
  id: string
  name: string
  workout_id: string
  sets: DB_Set[]
}

export interface Routine {
    isSynced: number
    updatedAt: string
    title: string
    routineId: string
    exercises: Exercise[]
}

export type IDB_Workout = Workout & {
  isSynced: number,
  updated_at: string
}
