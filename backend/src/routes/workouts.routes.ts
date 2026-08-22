import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getAllWorkouts, createWorkout } from '../controllers/workouts.controller'

const router = express.Router()

router.use(authMiddleware)
router.get("/", getAllWorkouts)
// router.get("/:id", getWorkoutByDate)
router.post("/", createWorkout)
// router.delete("/:id", deleteWorkout)
// router.put("/:id", editWorkout)

export default router;