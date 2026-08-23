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

export async function getAllRoutinesByUserId(userId: string){
    return prisma.routines.findMany({
    where: { user_id: userId },
    include: {
      routine_exercises: {          
        include: {
          routine_sets: true,      
        },
      },
    }
  })
}

export async function getRoutineById(routineId: string, userId: string){
    return prisma.routines.findUnique({
    where: { id: routineId, user_id: userId },
    include: {
      routine_exercises: {          
        include: {
          routine_sets: true,      
        },
      },
    }
  })
}

function buildExercisesCreateData(exercises: Exercise[]) {
  return exercises.map((exercise) => ({
    id: exercise.exerciseId,
    name: exercise.name,
    routine_sets: {
      create: exercise.sets.map((set) => ({
        id: set.setId,
        reps: set.reps,
        weight: set.weight,
      })),
    },
  }))
}

export async function createOrUpdateRoutine(
    userId: string,
    routineId: string,
    title: string,
    exercises: Exercise[]
){
    const existingRoutine = await prisma.routines.findUnique({
        where: {id: routineId, user_id: userId},
    })

    if (existingRoutine) 
    return prisma.routines.update({
        where: { id: existingRoutine.id },
        data: {
        routine_exercises: {
            deleteMany: {},
            create: buildExercisesCreateData(exercises),
        },
        },
        include: { routine_exercises: { include: { routine_sets: true } } },
    })

    return prisma.routines.create({
    data: {
        id: routineId,
        user_id: userId,
        title,
        routine_exercises: { create: buildExercisesCreateData(exercises) },
    },
    include: { routine_exercises: { include: { routine_sets: true } } },
    })
}

export async function deleteRoutineById(routineId: string, userId: string){
    return prisma.routines.delete({
        where: {id: routineId, user_id: userId}
    })
}

export async function getExercisesByRoutineId(routineId: string){
  return prisma.routine_exercises.findMany({
    where: {routine_id: routineId},
    include: {routine_sets: true},
  })
}