import ExerciseSetForm from "./ExerciseSetForm"
import { useWorkoutStore } from "../zustand_store/workout-store"
import dumbbellIcon from "../assets/dumbbell.svg"
import { RxCross2 } from "react-icons/rx";
export default function LogExerciseCard({exerciseId}:{exerciseId: string}){
    const exercise = useWorkoutStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useWorkoutStore((state) => state.addNewSet)
    const updateSet = useWorkoutStore((state) => state.updateSet)
    const toggleChecked = useWorkoutStore(state => state.toggleChecked)
    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }
  
    const setForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked}  onToggle={() => toggleChecked(exerciseId, idx)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, idx, "reps", v)} updateWeight={(v) => updateSet(exerciseId, idx, "weight", v)}/>
    })

    return(
        <div className="log-exercise-card">
            <div className="top">
                <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                <h3 className="exercise-name">{exercise?.exerciseName}</h3>   
                <RxCross2 size={20} color="#858585"/>
            </div>
            
            <div className="set-forms">{setForms}</div>  
            <button className="add-set-btn" onClick={handleAddSetBtnClick}>Add Set</button>
        </div>
    )
}
