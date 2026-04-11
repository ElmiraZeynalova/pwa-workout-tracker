import {NavLink} from 'react-router-dom'
import LoggedExerciseCard from './LoggedExerciseCard'
import { AiOutlinePlus } from "react-icons/ai";
import {useRenderWorkoutOnScreenStore} from '../zustand_store/render-workout-store'

export default function DayContent({date}: {date: string}){
    const workout = useRenderWorkoutOnScreenStore((state) => state.workouts[date])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise}/>
    ))
    return(
       <div className="day-content">
        {!loggedExercises && (
            <div className="no-workout-day">
                <p>Workout Log Is Empty</p>
                <NavLink to="/workouts/new" className="start-workout-btn">
                    <AiOutlinePlus size={28} color="#ff5526"/>
                    Start New Workout
                </NavLink>
            </div>
        )}
        {loggedExercises && <div className="workout-day">{loggedExercises}</div>}
    </div>
        
    )
}