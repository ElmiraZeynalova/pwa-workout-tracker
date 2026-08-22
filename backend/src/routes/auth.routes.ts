import express from 'express'
import {register, login, logout, checkMe} from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/me", authMiddleware, checkMe)

export default router;