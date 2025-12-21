import { NavLink } from "react-router"
import {useState} from 'react'
import type { ReactNode } from "react"
import exercises from '../exercises.json'
import { useAllChosenExercisesStore } from "../store"
import type { SelectedExercise } from "../store"


export default function AddExercise(){
    const [exerciseSelected, setExerciseSelected] = useState<boolean>(false)
    const addNewExercise = useAllChosenExercisesStore((state) => state.addNewExercise)

    function handleExerciseChoice(exerciseObj: SelectedExercise){
        setExerciseSelected(prev => !prev)
        addNewExercise(exerciseObj)
    }

    const exercisesList: ReactNode[] = exercises.map(obj => {
        return <div key={obj.exerciseName} onClick={() => handleExerciseChoice(obj)} className="exercise">
                <div className="exercise-name">{obj.exerciseName}</div>
                <div className="exercise-muscle">{obj.muscleGroup}</div>
            </div>
    })

    function handleAddExerciseClick(){
        setExerciseSelected(prev => !prev)
    }

    return(
        <>
            <NavLink to="/workouts/new">Cancel</NavLink>
            <h1>All Exercises</h1>
            {exercisesList}
            {exerciseSelected && <NavLink to="/workouts/new" onClick={handleAddExerciseClick}>Add exercise</NavLink>}
        </>
        
    )
}