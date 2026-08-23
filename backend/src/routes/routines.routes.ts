import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware'
import {getAllRoutines, getRoutine, createRoutine, deleteRoutine, getRoutineExercises } from '../controllers/routines.controller'

const router = express.Router()

router.use(authMiddleware)
router.get("/", getAllRoutines)
router.get("/:id", getRoutine)
router.post("/", createRoutine)
router.delete("/:id", deleteRoutine)
router.get("/:id/exercises", getRoutineExercises)

export default router;