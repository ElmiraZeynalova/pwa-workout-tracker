import express from 'express'
import {register, login, logout, checkMe, refresh} from '../controllers/auth.controller'
import { authMiddleware } from '../middlewares/authMiddleware'
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh", refresh)
router.get("/me", authMiddleware, checkMe)

export default router;