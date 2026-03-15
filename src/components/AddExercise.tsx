import { NavLink } from "react-router-dom"
import {useState} from 'react'
import exercises from '../exercises.json'
import { useWorkoutStore } from "../store/workout-store"
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
                        <span className="muscle-group">{exercise.muscleGroup}</span>
                    </div>
                 </div>
    })      
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/workouts/new">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </NavLink>
                <p>All Exercises</p>
                <div style={{width: '25px'}}></div>
            </header>

            {exercisesList}
           
            {chosenExercises.length > 0 && <NavLink to="/workouts/new" className="add-exercise-btn" onClick={saveChosenExercises}>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</NavLink>}
        </div>
        
    )
}