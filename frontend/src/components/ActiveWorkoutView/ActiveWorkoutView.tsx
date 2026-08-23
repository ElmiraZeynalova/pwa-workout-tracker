import styles from './ActiveWorkoutView.module.css'
import LoggingExerciseCard from '../LoggingExerciseCard/LoggingExerciseCard'
import { useExercisesStore } from '../../store/exercises-store'
import Button from '../Button/Button'
import { AiOutlinePlus } from "react-icons/ai"
import { ROUTES } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'

export default function ActiveWorkoutView(){
    const navigate = useNavigate()
    const currentWorkoutExercises = useExercisesStore(state => state.exercises)

    const exercisesCards = currentWorkoutExercises.map(exercise => {
        return <LoggingExerciseCard key={exercise.exerciseId} exerciseId={exercise.exerciseId} purpose="logWorkout"/>
    })
    
    function handleAddExerciseClick(){
        navigate(ROUTES.WORKOUTS_NEW_EXERCISES)
    }

    return(
        <div className={styles.logScreenWithExercisesAdded}>
            {exercisesCards}
            <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                <AiOutlinePlus size={22} color="white"/>
                Add Exercise
            </Button>
        </div>
    )
}