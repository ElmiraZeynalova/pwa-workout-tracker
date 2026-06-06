import {NavLink} from 'react-router-dom'
import LoggedExerciseCard from './LoggedExerciseCard'
import { AiOutlinePlus } from "react-icons/ai";
import {useRenderWorkoutOnScreenStore} from '../store/render-workout-store'
import styles from './DayContent.module.css'
export default function DayContent({date}: {date: string}){
    const workout = useRenderWorkoutOnScreenStore((state) => state.workouts[date])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise}/>
    ))
    const hasWorkout = workout && workout.exercises.length > 0
    return(
       <div className={styles.dayContent}>
        {!hasWorkout && (
            <div className={styles.noWorkoutDay}>
                <p>Workout Log Is Empty</p>
                <NavLink to="/workouts/new" className={styles.startWorkoutBtn}>
                    <AiOutlinePlus size={28} color="#ff5526"/>
                    Start New Workout
                </NavLink>
            </div>
        )}
        {hasWorkout && <div className={styles.workoutDay}>{loggedExercises}</div>}
    </div>
        
    )
}