import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import { getAllWorkouts, createWorkout, deleteWorkout, getWorkout } from '../controllers/workouts.controller'

const router = express.Router()

router.use(authMiddleware)
router.get("/", getAllWorkouts)
router.get("/:id", getWorkout)
router.post("/", createWorkout)
router.delete("/:id", deleteWorkout)
// router.put("/:id", editWorkout)

export default router;