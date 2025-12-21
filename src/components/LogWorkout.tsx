import { NavLink } from "react-router"
import { useState, useEffect } from 'react'
import { useAllChosenExercisesStore } from "../store"
import type { SelectedExercise } from "../store"

export default function LogWorkout(){

    const exercises = useAllChosenExercisesStore((state) => state.exercises)

    const exerciseElements = exercises.map((exercise, idx) => {
        return <p key={idx}>{exercise.exerciseName}</p>
    })

    return(
    <>
        <NavLink to="/">Go Home</NavLink>
        {exercises.length > 0 && <div>Added exercises: {exerciseElements}</div>}
        {exercises.length === 0 && 
            <div>
                <h2>Get started</h2>
                <p>Add an exercise to start your workout</p>
            </div>}
        <NavLink to="/workouts/new/exercises">Add Exercise</NavLink>
    </>
        
    )
}
//******ADD ABILITY TO LOG REPS AND SETS FOR EACH CHOSEN EXERCISE********








// type ExerciseSet = {
//     reps: number,
//     weight?: number
// }

// type Exercise = {
//     id: string,
//     exerciseName: string,
//     sets: ExerciseSet[]
// }

// type Workout = {
//     id: string,
//     date: string,
//     exercises: Exercise[]
// }

// const workouts: Workout[] = [
//     {
//         id: crypto.randomUUID(),
//         date: "2025-12-20",
//         exercises: [
//             {
//                 id: crypto.randomUUID(),
//                 exerciseName: "Bicep curls",
//                 sets: [
//                     {reps: 12, weight: 25},
//                     {reps: 11, weight: 25},
//                     {reps: 10, weight: 25}
//                 ]
//             },
//         ]
//     }
// ]