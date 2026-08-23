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