import ExerciseSetForm from "./ExerciseSetForm"
import dumbbellIcon from "../assets/dumbbell.svg"
import { RxCross2 } from "react-icons/rx";
import { useEditExerciseStore} from "../zustand_store/edit-exercise-store"

export default function EditExerciseCard(){
    const exercise = useEditExerciseStore((state) => state.editingExercise)
    const exerciseSets = exercise?.sets
    const addNewSet = useEditExerciseStore((state) => state.addNewSet)
    const updateSet = useEditExerciseStore((state) => state.updateSet)
    const toggleChecked = useEditExerciseStore((state) => state.toggleChecked)

    function handleAddSetBtnClick(){
        addNewSet()
    }
  
    const setForms = exerciseSets?.map((set, idx) => {
        return <ExerciseSetForm key={idx} idx={idx} checked={set.checked} onToggle={() => toggleChecked(set.setId)} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(set.setId, "reps", v)} updateWeight={(v) => updateSet(set.setId, "weight", v)}/>
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
