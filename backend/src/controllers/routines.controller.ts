import {Request, Response} from 'express'
import {getAllRoutinesByUserId, getRoutineById, createOrUpdateRoutine, deleteRoutineById, getExercisesByRoutineId} from '../services/routines.service'
import { createRoutineSchema } from '../validators/routinesValidators'

export async function getAllRoutines(req: Request, res: Response){
    try{
        const routines = await getAllRoutinesByUserId(req.user.id)
        res.status(200).json(routines)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getRoutine(req: Request, res: Response){
    const {id} = req.params
    const userId = req.user.id

    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid workout id'})
    }

    try{
        const routine = await getRoutineById(id, userId)
        res.status(200).json(routine)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function createRoutine(req: Request, res: Response){
    const parseResult = createRoutineSchema.safeParse(req.body)
    if(!parseResult.success){
        return res.status(400).json({error: parseResult.error.issues})
    }
    const userId = req.user.id

    const {routineId, title, exercises} = parseResult.data

    try{
        const routine = await createOrUpdateRoutine(userId, routineId, title, exercises)
        res.status(201).json(routine)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function deleteRoutine(req: Request, res: Response){
    const {id} = req.params
    const userId = req.user.id

    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid workout id'})
    }

    try{
        const routine = await deleteRoutineById(id, userId)
        res.status(200).json(routine)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function getRoutineExercises(req: Request, res: Response){
    const {id} = req.params

    if(typeof id !== 'string'){
        return res.status(400).json({error: 'Invalid routine id'})
    }

    try{
        const exercises = await getExercisesByRoutineId(id)
        res.status(200).json(exercises)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }

}