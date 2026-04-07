import { NavLink } from "react-router-dom"
import {useState} from 'react'
import exercises from '../exercises.json'
import { useWorkoutStore } from "../zustand_store/workout-store"
import { FaChevronLeft } from "react-icons/fa";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import dumbbellIcon from "../assets/dumbbell.svg"
export default function ExercisesListPage(){

    const [chosenExercises, setChosenExercises] = useState<string[]>([])
    const addNewExercises = useWorkoutStore((state) => state.addNewExercises)
    const [search, setSearch] = useState<string>("")
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

    const hasInput = search.trim().length > 0
    const filteredExercises = hasInput ? exercises.filter(e => e.exerciseName.toLowerCase().includes(search.toLowerCase())) : exercises
    const exercisesList = filteredExercises.length > 0 ?
        filteredExercises.map(e => {
            return(
                <div key={e.exerciseName} className="exercise-in-list" onClick={() => handleExerciseChoice(e.exerciseName)}>
                    {chosenExercises.includes(e.exerciseName) && <div className="selected-exercise"></div>}
                    <img src={dumbbellIcon} alt="exercise icon" width={55} height={55}/>
                    <div className="exercise-info">
                        <p className="exercise-name">{e.exerciseName}</p>
                        <p className="muscle-group">{e.muscleGroup}</p>
                    </div>
                </div>
            )}) :
                <div className="no-search-results">
                    <h3>Can't find {search}</h3>
                    <p>We don't have that exercise in our database yet.</p>
                </div>
     
    return(
        <div className="layout" style={{ overflowY: 'auto'}} >

            <header>
                <NavLink className="header-btn" to="/workouts/new">
                    <FaChevronLeft size={16} color="black"/>
                </NavLink>
                <p>All Exercises</p>
                <div style={{width: '16px'}}></div>
            </header>

            <div className="search-bar">
                <form>
                    <PiMagnifyingGlassBold className="glass" size={18} color="#a7a7a7"/>
                    <input 
                        type="text"
                        placeholder="Search exercise"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </form>

            </div>

            <main style={{height: 0}}>
                <div className="exercises-list-page-content">
                    {exercisesList}
                    {chosenExercises.length > 0 && <NavLink to="/workouts/new" className="add-exercise-btn-list-screen" onClick={saveChosenExercises}>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</NavLink>}
                </div>
            </main>
        </div>
        
    )
}