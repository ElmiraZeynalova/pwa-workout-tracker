import ExerciseSetForm from '../forms/ExerciseSetForm/ExerciseSetForm'
import { useExercisesStore } from '../../store/exercises-store'
import dumbbellIcon from '../../assets/dumbbell.svg'
import { RxCross2 } from "react-icons/rx";
import styles from './LoggingExerciseCard.module.css'
import ExerciseRoutineSetForm from '../forms/ExerciseRoutineSetForm/ExerciseRoutineSetForm'

export default function LoggingExerciseCard({exerciseId, purpose}:{exerciseId: string, purpose: string}){
    const exercise = useExercisesStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useExercisesStore((state) => state.addNewSet)
    const updateSet = useExercisesStore((state) => state.updateSet)
    const toggleChecked = useExercisesStore(state => state.toggleChecked)
    const deleteExercise =useExercisesStore(state => state.deleteExercise)
    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }
  
    const logWorkoutSetForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked}  onToggle={() => toggleChecked(exerciseId, set.setId)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, set.setId, "reps", v)} updateWeight={(v) => updateSet(exerciseId, set.setId, "weight", v)}/>
    })

    const routineSetForms = exerciseSets?.map((set, idx) => {
        return <ExerciseRoutineSetForm key={idx} idx={idx} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, set.setId, "reps", v)} updateWeight={(v) => updateSet(exerciseId, set.setId, "weight", v)}/>
    })

    return(
        <div className={styles.loggingExerciseCard}>
            <div className={styles.top}>
                <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                <h3 className={styles.exerciseName}>{exercise?.exerciseName}</h3>   
                <RxCross2 size={20} className={styles.crossBtn} color="#858585" onClick={() => deleteExercise(exerciseId)}/>
            </div>
            
            <div className={styles.setForms}>{purpose === "routine" ? routineSetForms : logWorkoutSetForms}</div>  
            <button className={styles.addSetBtn} onClick={handleAddSetBtnClick}>Add Set</button>
        </div>
    )
}
