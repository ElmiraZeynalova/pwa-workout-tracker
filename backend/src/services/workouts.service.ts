import {prisma} from '../config/db'

interface Set {
  setId: string
  reps: number
  weight: number
}

interface Exercise {
  exerciseId: string
  name: string
  sets: Set[]
}

export async function getAllWorkoutsByUserId(userId: string){
    return prisma.workouts.findMany({
    where: { user_id: userId },
    include: {
      exercises: {          
        include: {
          sets: true,      
        },
      },
    }
  })
}

export async function createOneWorkout(
  userId: string,
  workoutId: string,
  date: string,
  exercises: Exercise[]
) {
  return prisma.workouts.create({
    data: {
      id: workoutId,
      user_id: userId,
      date: date,
      exercises: {
        create: exercises.map((exercise) => ({
          id: exercise.exerciseId,
          name: exercise.name,
          sets: {
            create: exercise.sets.map((set) => ({
              id: set.setId,
              reps: set.reps,
              weight: set.weight,
            })),
          },
        })),
      },
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  })
}