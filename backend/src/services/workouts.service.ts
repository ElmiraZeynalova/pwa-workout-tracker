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

export async function getWorkoutById(workoutId: string, userId: string){
    return prisma.workouts.findUnique({
    where: { id: workoutId, user_id: userId },
    include: {
      exercises: {          
        include: {
          sets: true,      
        },
      },
    }
  })
}

function buildExercisesCreateData(exercises: Exercise[]) {
  return exercises.map((exercise) => ({
    id: exercise.exerciseId,
    name: exercise.name,
    sets: {
      create: exercise.sets.map((set) => ({
        id: set.setId,
        reps: set.reps,
        weight: set.weight,
      })),
    },
  }))
}


export async function createOrAppendWorkout(
  userId: string,
  workoutId: string,
  date: string,
  exercises: Exercise[]
) {

  const existingWorkout = await prisma.workouts.findUnique({
    where: {user_id_date: { user_id: userId, date }},
  })

  if(existingWorkout){
    return prisma.workouts.update({
      where: {id: existingWorkout.id},
      data: { exercises: { create: buildExercisesCreateData(exercises) } },
      include: { exercises: { include: { sets: true } } },
    })

  }
  return prisma.workouts.create({
    data: {
      id: workoutId,
      user_id: userId,
      date: date,
      exercises: {create: buildExercisesCreateData(exercises)},
    },
    include: { exercises: { include: { sets: true } } },
  })
}

export async function deleteWorkoutById(workoutId: string, userId: string){
  return prisma.workouts.delete({
    where: {id: workoutId, user_id: userId}
  })
}