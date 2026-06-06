import ExerciseSetForm from "./ExerciseSetForm"
import { useWorkoutStore } from "../store/workout-store"
import dumbbellIcon from "../assets/dumbbell.svg"
import { RxCross2 } from "react-icons/rx";
import styles from './LoggingExerciseCard.module.css'

export default function LoggingExerciseCard({exerciseId}:{exerciseId: string}){
    const exercise = useWorkoutStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useWorkoutStore((state) => state.addNewSet)
    const updateSet = useWorkoutStore((state) => state.updateSet)
    const toggleChecked = useWorkoutStore(state => state.toggleChecked)
    const deleteExercise = useWorkoutStore(state => state.deleteExercise)
    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }
  
    const setForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked}  onToggle={() => toggleChecked(exerciseId, set.setId)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, set.setId, "reps", v)} updateWeight={(v) => updateSet(exerciseId, set.setId, "weight", v)}/>
    })

    return(
        <div className={styles.loggingExerciseCard}>
            <div className={styles.top}>
                <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                <h3 className={styles.exerciseName}>{exercise?.exerciseName}</h3>   
                <RxCross2 size={20} className={styles.crossBtn} color="#858585" onClick={() => deleteExercise(exerciseId)}/>
            </div>
            
            <div className={styles.setForms}>{setForms}</div>  
            <button className={styles.addSetBtn} onClick={handleAddSetBtnClick}>Add Set</button>
        </div>
    )
}
