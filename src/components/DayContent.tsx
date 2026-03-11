import {NavLink} from 'react-router-dom'
import {getWorkoutByDate} from "../indexedDB"
import {useEffect, useState} from "react"
import type {Exercise} from '../store/workout-store'
import LoggedExercise from './LoggedExercise'

type Workout = {
    date: string,
    exercises: Exercise[]
}

export default function DayContent({date}: {date: string}){

    const [workout, setWorkout] = useState<Workout | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadWorkout(){
            const data = await getWorkoutByDate(date)
            setWorkout(data ?? null)
            setLoading(false)
        }
        loadWorkout()
    }, [date])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExercise key={exercise.exerciseId} exercise={exercise}/>
    ))
    return(
       <div className="day-content">
        {!loading && workout === null && 
            <div className="no-workout-day">
                <p>Workout Log Is Empty</p>
                <NavLink to="/workouts/new" className="start-workout-btn">
                    <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
                    </svg>
                    Start New Workout
                </NavLink>
            </div>
        }
        {!loading && workout && <div className="workout-day">{loggedExercises}</div>}
    </div>
        
    )
}