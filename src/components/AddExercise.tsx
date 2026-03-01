import { NavLink } from "react-router-dom"
import {useState} from 'react'
import exercises from '../exercises.json'
import { useWorkoutStore } from "../store"

export default function AddExercise(){

    const [showAddExrBtn, setShowAddExrBtn] = useState<boolean>(false)
    const [chosenExercise, setChosenExercise] = useState<string>("")

    const addNewExercise = useWorkoutStore((state) => state.addNewExercise)
    
    function handleExerciseChoice(exerciseName: string){
        setShowAddExrBtn(prev => !prev)
        setChosenExercise(exerciseName)
    }

    function saveChosenExercises(){
        addNewExercise(chosenExercise)
    }

    const exercisesList = exercises.map(exercise => {
        return <div key={exercise.exerciseName} className="exercise" onClick={() => handleExerciseChoice(exercise.exerciseName)}>
            {exercise.exerciseName}
            <span>{exercise.muscleGroup}</span>
        </div>
    })
    return(
        <>
            <NavLink to="/workouts/new">Cancel</NavLink>
            <h1>All Exercises</h1>
            {exercisesList}
           
            {showAddExrBtn && <NavLink to="/workouts/new" className="add-exercise-btn" onClick={saveChosenExercises}>Add Exercise</NavLink>} 
        </>
        
    )
}