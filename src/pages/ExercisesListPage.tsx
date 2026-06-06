import { NavLink } from "react-router-dom"
import {useState} from 'react'
import exercises from '../data/exercises.json'
import { useWorkoutStore } from "../store/workout-store"
import { FaChevronLeft } from "react-icons/fa";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import dumbbellIcon from "../assets/dumbbell.svg"
import Header from '../components/Header'
import styles from './ExercisesListPage.module.css'

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
                <div key={e.exerciseName} className={styles.exerciseInList} onClick={() => handleExerciseChoice(e.exerciseName)}>
                    {chosenExercises.includes(e.exerciseName) && <div className={styles.selectedExercise}></div>}
                    <img src={dumbbellIcon} alt="exercise icon" width={55} height={55}/>
                    <div className={styles.exerciseInfo}>
                        <p className={styles.exerciseName}>{e.exerciseName}</p>
                        <p className={styles.muscleGroup}>{e.muscleGroup}</p>
                    </div>
                </div>
            )}) :
                <div className={styles.noSearchResults}>
                    <h3>Can't find {search}</h3>
                    <p>We don't have that exercise in our database yet.</p>
                </div>
     
    return(
        <div className="layout" style={{ overflowY: 'auto'}} >

            <Header 
                title={<p className={styles.title}>All Exercises</p>}
                leftButton={<NavLink className={styles.headerBtn} to="/workouts/new"><FaChevronLeft size={16} color="black"/></NavLink>}
                rightButton={<div style={{width: '16px'}}></div>}
            />
            <div className={styles.searchBar}>
                <form>
                    <PiMagnifyingGlassBold size={18} color="#a7a7a7"/>
                    <input 
                        type="text"
                        placeholder="Search exercise"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </form>

            </div>

            <main style={{height: 0}}>
                <div className={styles.exercisesListPageContent}>
                    {exercisesList}
                    {chosenExercises.length > 0 && <NavLink to="/workouts/new" className={styles.addExerciseBtnListScreen} onClick={saveChosenExercises}>{chosenExercises.length === 1 ? "Add 1 exercise" : `Add ${chosenExercises.length} exercises`}</NavLink>}
                </div>
            </main>
        </div>
        
    )
}