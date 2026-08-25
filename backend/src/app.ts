import express from 'express'
import authRoutes from './routes/auth.routes'
import workoutsRoutes from './routes/workouts.routes'
import routinesRoutes from './routes/routines.routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(express.json())
app.use(cookieParser()) 
app.use(express.urlencoded({extended: true}))
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL!],
  credentials: true,
}))

app.use("/auth", authRoutes)
app.use("/workouts", workoutsRoutes)
app.use("/routines", routinesRoutes)

export default app;