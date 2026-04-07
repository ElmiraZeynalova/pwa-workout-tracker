import {NavLink} from 'react-router-dom'
import {getWorkoutByDate} from '../indexed_db/crud'
import {useEffect, useState} from "react"
import LoggedExerciseCard from './LoggedExerciseCard'
import {useForceRerenderStore} from "../zustand_store/force-rerender-store"
import { AiOutlinePlus } from "react-icons/ai";

type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}
type Workout = {
    isSynced: number
    date: string,
    exercises: Exercise[]
}

export default function DayContent({date}: {date: string}){
    const rerender = useForceRerenderStore(state => state.forceRerender)
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadWorkout()
    }, [rerender])

    async function loadWorkout(){
        const data = await getWorkoutByDate(date)
        if(data && data.exercises.length > 0){
            setWorkout(data)
            setLoading(false)
        }else{
            setWorkout(null)
            setLoading(false)
        }

    }

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise} onDelete={loadWorkout}/>
    ))
    return(
       <div className="day-content">
        {!loading && workout === null && (
            <div className="no-workout-day">
                <p>Workout Log Is Empty</p>
                <NavLink to="/workouts/new" className="start-workout-btn">
                    <AiOutlinePlus size={28} color="#ff5526"/>
                    Start New Workout
                </NavLink>
            </div>
        )}
        {!loading && workout !== null && <div className="workout-day">{loggedExercises}</div>}
    </div>
        
    )
}