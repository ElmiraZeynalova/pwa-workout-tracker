import LoggedExerciseCard from '../LoggedExerciseCard/LoggedExerciseCard'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import styles from './DayContent.module.css'
import {useRef} from 'react'
import { useDateStore } from '../../store/date-store'
import GrabberSheet from '../GrabberSheet/GrabberSheet'

export default function DayContent({date}: {date: string}){
    const workout = useRenderDataOnScreenStore((state) => state.workouts[date])
    const dayContentRef = useRef<HTMLDivElement | null>(null)
    const selectedDate = useDateStore(state => state.selectedDate)
    const loggedExercises = workout?.exercises?.map(exercise => (
        <LoggedExerciseCard key={exercise.exerciseId} date={date} exercise={exercise}/>
    ))

    const hasWorkout = workout && workout.exercises.length > 0

    return(
       <div ref={dayContentRef} className={styles.dayContent}>
        {!hasWorkout && (
            <div className={styles.noWorkoutDay}>
                <p>Workout Log Is Empty</p>
                {date === selectedDate && <GrabberSheet containerRef={dayContentRef}/>}
            </div>
        )}
        {hasWorkout && <div className={styles.workoutDay}>{loggedExercises}</div>}
    </div>
        
    )
}