import {NavLink} from 'react-router-dom'
import LoggedExerciseCard from '../LoggedExerciseCard/LoggedExerciseCard'
import { Icon } from '@iconify/react'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import styles from './DayContent.module.css'
import { ROUTES } from '../../utils/constants';

export default function DayContent({date}: {date: string}){
    const workout = useRenderDataOnScreenStore((state) => state.workouts[date])

    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise}/>
    ))
    const hasWorkout = workout && workout.exercises.length > 0
    return(
       <div className={styles.dayContent}>
        {!hasWorkout && (
            <div className={styles.noWorkoutDay}>
                <p>Workout Log Is Empty</p>
                <NavLink to={ROUTES.WORKOUTS_NEW} className={styles.startWorkoutBtn}>
                    <Icon icon="boxicons:plus" color="#ff5526" width={28} height={28}/>
                    Start New Workout
                </NavLink>
            </div>
        )}
        {hasWorkout && <div className={styles.workoutDay}>{loggedExercises}</div>}
    </div>
        
    )
}