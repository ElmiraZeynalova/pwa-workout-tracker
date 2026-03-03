import SetForm from "./SetForm"
import { useWorkoutStore } from "../store"

export default function Exercise({exerciseId}:{exerciseId: string}){
    const exercise = useWorkoutStore((state) => state.exercises.find(e => e.exerciseId === exerciseId))
    const exerciseSets = exercise?.sets
    const addNewSet = useWorkoutStore((state) => state.addNewSet)
    const updateSet = useWorkoutStore((state) => state.updateSet)

    function handleAddSetBtnClick(){
        addNewSet(exerciseId)
    }
  
    const setForms = exerciseSets?.map((set, idx) => {
        return <SetForm key={idx} reps={set.reps} weight={set.weight} updateReps={(v) => updateSet(exerciseId, idx, "reps", v)} updateWeight={(v) => updateSet(exerciseId, idx, "weight", v)}/>
    })

    return(
    <div className="exercise-card">
        <h3>{exercise?.exerciseName}</h3>   
        <div className="set-forms">{setForms}</div>  
        <button className="add-set-btn" onClick={handleAddSetBtnClick}>
            <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
            </svg>
            Add Set
        </button>
    </div>)
}
