import {Request, Response} from 'express'
import {getAllWorkoutsByUserId, createOrUpdateWorkout, deleteWorkoutById, getWorkoutById, getExercisesByWorkoutId} from '../services/workouts.service'
import {createWorkoutSchema} from '../validators/workoutsValidators'

export async function getAllWorkouts(req: Request, res: Response){
    try{
        const workouts = await getAllWorkoutsByUserId(req.user.id)
        res.status(200).json(workouts)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getWorkout(req: Request, res: Response){
    const {id} = req.params
    const userId = req.user.id

    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid workout id'})
    }

    try{
        const workout = await getWorkoutById(id, userId)
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function createWorkout(req: Request, res: Response){
    const parseResult = createWorkoutSchema.safeParse(req.body)
    if(!parseResult.success){
        return res.status(400).json({error: parseResult.error.issues})
    }
    const userId = req.user.id

    const {workoutId, date, exercises} = parseResult.data

    try{
        const workout = await createOrUpdateWorkout(userId, workoutId, date, exercises)
        res.status(201).json(workout)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function deleteWorkout(req: Request, res: Response){
    const {id} = req.params
    const userId = req.user.id
    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid workout id'})
    }

    try{
        const workout = await deleteWorkoutById(id, userId)
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getWorkoutExercises(req: Request, res: Response){
    const {id} = req.params

    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid workout id'})
    }

    try{
        const exercises = await getExercisesByWorkoutId(id)
        res.status(200).json(exercises)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }


}