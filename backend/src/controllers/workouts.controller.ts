import {Request, Response} from 'express'
import {getAllWorkoutsByUserId, createOneWorkout} from '../services/workouts.service'
import {createWorkoutSchema} from '../validators/workoutsValidators'

export async function getAllWorkouts(req: Request, res: Response){
    try{
        const workouts = await getAllWorkoutsByUserId(req.user.id)
        res.status(200).json(workouts)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

// export async function getWorkoutByDate(){

// }

export async function createWorkout(req: Request, res: Response){
    const parseResult = createWorkoutSchema.safeParse(req.body)
    if(!parseResult.success){
        return res.status(400).json({error: parseResult.error.issues})
    }
    const userId = req.user.id
    const {workoutId, date, exercises} = parseResult.data

    try{
        const workout = await createOneWorkout(userId, workoutId, date, exercises)
        res.status(201).json(workout)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}


// router.get("/:id", getWorkoutByDate)
// router.post("/", createWorkout)
// router.delete("/:id", deleteWorkout)
// router.put("/:id", editWorkout)