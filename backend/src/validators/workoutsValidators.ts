import {z} from 'zod'

export const setSchema = z.object({
  setId: z.string().uuid(),
  reps: z.number().int().positive(),
  weight: z.number().positive(),
})

export const exerciseSchema = z.object({
  exerciseId: z.string().uuid(),
  name: z.string().min(1),
  sets: z.array(setSchema),
})

export const createWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  date: z.string(),
  exercises: z.array(exerciseSchema),
})
