import {NavLink} from 'react-router-dom'
import {getWorkoutByDate} from "../indexedDB"
import {useEffect, useState} from "react"
import type {Exercise} from '../store/workout-store'
import LoggedExercise from './LoggedExercise'
import {useForceRerenderStore} from "../store/force-rerender-store"
import { AiOutlinePlus } from "react-icons/ai";
type Workout = {
    date: string,
    exercises: Exercise[]
}

export default function DayContent({date}: {date: string}){
    const rerender = useForceRerenderStore(state => state.forceRerender)
    const [workout, setWorkout] = useState<Workout | null>(null)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        async function loadWorkout(){
            const data = await getWorkoutByDate(date)
            setWorkout(data ?? null)
            setLoading(false)
        }
        loadWorkout()
    }, [date, rerender])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExercise key={exercise.exerciseId} exercise={exercise}/>
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
        {!loading && workout && <div className="workout-day">{loggedExercises}</div>}
    </div>
        
    )
}