import { useNavigate } from "react-router-dom"
import {useEffect} from 'react'
import { useWorkoutStore} from "../zustand_store/workout-store"
import { useDateStore } from "../zustand_store/date-store"
import { FaChevronLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom'
import {getExerciseDataByDateAndId, deleteExerciseById, editExercise, markWorkoutUnsynced} from '../indexed_db/crud'
import LogExerciseCard from "./LogExerciseCard";
import { syncServerWithIDB } from '../supabaseDB'

type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
    checked: boolean
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}
export default function EditExercisePage(){
    const navigate = useNavigate()
    const { state } = useLocation()
    const exerciseId = state.exerciseId
    const workoutDate = useDateStore(state => state.selectedDate)
    const loadExerciseForEdit = useWorkoutStore(state => state.loadExerciseForEdit)
    const editingExercise = useWorkoutStore((state) => state.exercises[0])
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout) 

    useEffect(() => {
        const loadExercise = async() => {
            const data = await getExerciseDataByDateAndId(workoutDate, exerciseId)
            if(!data) return
            const formatedExercise: Exercise = {...data, sets: data.sets.map((s :any) => ({setId: s.setId, reps: s.reps, weight: s.weight, checked: true}))}
            loadExerciseForEdit(formatedExercise)
        }
        loadExercise()
    }, [])

    async function handleSave(){
        const cleanExerciseData = {
            exerciseId: editingExercise.exerciseId,
            exerciseName: editingExercise.exerciseName,
            sets: editingExercise.sets
                    .filter(s => s.checked === true)
                    .map(s => ({setId: s.setId, reps: s.reps, weight: s.weight}))
                    .filter(s => s.reps !== null && s.reps > 0)
                    .map(s => s.weight === null ? {...s, weight: 0} : s)
        }
        if(cleanExerciseData.sets.length === 0) {
            await deleteExerciseById(workoutDate, exerciseId)
        }else{
            await editExercise(workoutDate, cleanExerciseData)
        }

        try {
            await markWorkoutUnsynced(workoutDate)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        clearWorkoutStore()
        navigate('/')

        syncServerWithIDB()
        console.log("Server is synced with IDB")
    }

    function handleExitEditPage(){
        clearWorkoutStore()
        navigate('/')
    }
   
    return(
        <div className="layout">
            <header>
                <button className="header-btn" onClick={handleExitEditPage}>
                    <FaChevronLeft size={16}/>
                </button>
                <p style={{marginLeft: '50px'}}>Edit Exercise</p>
                <button className="save-btn" onClick={handleSave}>Save</button>
            </header>

            <main style={{overflowY: 'auto'}}>
                <div className="edit-exersise-page">
                    <LogExerciseCard exerciseId={exerciseId}/>
                </div>
            </main>     
        </div>
    )
}











