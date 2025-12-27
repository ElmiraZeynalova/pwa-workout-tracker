import { NavLink } from "react-router"
import { useWorkoutStore } from "../store"
import Exercise from "./Exercise"
export default function LogWorkout(){

    const workoutExercises = useWorkoutStore((state) => state.exercises)

    const exerciseCards = workoutExercises.map(exercise => {
        return <Exercise key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
    })

    return(
    <>
        <NavLink to="/">Go Home</NavLink>
        {exerciseCards.length > 0 && 
            <div className="all-exercise-cards">{exerciseCards}</div>
        }
        {exerciseCards.length === 0 && 
            <>
                <h2>Get started</h2>
                <p>Add an exercise to start your workout</p>
            </>
        }        
        <NavLink to="/workouts/new/exercises" className="add-exercise-btn">
            <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
            </svg>
            Add Exercise
        </NavLink>

    </>
        
    )
}









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