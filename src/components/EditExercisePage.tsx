import { useNavigate } from "react-router-dom"
import {useEffect} from 'react'
import { useEditExerciseStore} from "../zustand_store/edit-exercise-store"
import { useDateStore } from "../zustand_store/date-store"
import { FaChevronLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom'
import { deleteExerciseById, editExercise, markWorkoutUnsynced} from '../indexed_db/crud'
import EditExerciseCard from "./EditExerciseCard";
import { syncServerWithIDB } from '../supabaseDB'
import {useRenderWorkoutOnScreenStore} from '../zustand_store/render-workout-store'

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
    const setExerciseForEdit = useEditExerciseStore(state => state.setExerciseForEdit)
    const editingExercise = useEditExerciseStore((state) => state.editingExercise)
    const workout = useRenderWorkoutOnScreenStore((state) => state.workouts[workoutDate])
    const exercise = workout?.exercises.find(e => e.exerciseId === exerciseId)
    const removeExercise = useRenderWorkoutOnScreenStore((state) => state.removeExercise)
    const updateExercise = useRenderWorkoutOnScreenStore((state) => state.updateExercise)
    useEffect(() => {
        if (!exercise) return

        const formattedExercise: Exercise = {
            ...exercise,
            sets: exercise.sets.map(s => ({
                setId: s.setId,
                reps: s.reps,
                weight: s.weight,
                checked: true
            }))
        }

        setExerciseForEdit(formattedExercise)
    }, [exercise?.exerciseId])

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
            removeExercise(workoutDate, cleanExerciseData.exerciseId)
            await deleteExerciseById(workoutDate, exerciseId)
        }else{
            updateExercise(workoutDate, cleanExerciseData)
            await editExercise(workoutDate, cleanExerciseData)
        }

        try {
            await markWorkoutUnsynced(workoutDate)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        navigate('/')
        syncServerWithIDB().catch(console.warn)
    }

    function handleExitEditPage(){
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
                    <EditExerciseCard />
                </div>
            </main>     
        </div>
    )
}











