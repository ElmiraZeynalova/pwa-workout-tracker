import { NavLink } from "react-router-dom"
import {useState} from 'react'
import exercises from '../exercises.json'
import { useWorkoutStore } from "../store"
import clsx from 'clsx';

export default function AddExercise(){

    const [chosenExercises, setChosenExercises] = useState<string[]>([])
    const addNewExercises = useWorkoutStore((state) => state.addNewExercises)

    function handleExerciseChoice(exerciseName: string){
        setChosenExercises((prev) => 
            prev.includes(exerciseName) 
                ? prev.filter(e => e !== exerciseName)
                : [...prev, exerciseName]
        )
    }

    function saveChosenExercises(){
        addNewExercises(chosenExercises)
    }

    const exercisesList = exercises.map(exercise => {
        return <div key={exercise.exerciseName} className="exercise">
            <div className={clsx("exerciseInfo", { selected: chosenExercises.includes(exercise.exerciseName) })} onClick={() => handleExerciseChoice(exercise.exerciseName)}>
                {exercise.exerciseName}
                <span>{exercise.muscleGroup}</span>
            </div>
        </div>
    })
    return(
        <>
            <NavLink to="/workouts/new">Cancel</NavLink>
            <h1>All Exercises</h1>
            {exercisesList}
           
            {chosenExercises.length > 0 && <NavLink to="/workouts/new" className="add-exercise-btn" onClick={saveChosenExercises}>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</NavLink>}
        </>
        
    )
}