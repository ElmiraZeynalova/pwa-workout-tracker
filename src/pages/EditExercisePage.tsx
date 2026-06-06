import { useNavigate } from "react-router-dom"
import {useEffect} from 'react'
import { useEditExerciseStore} from "../store/edit-exercise-store"
import { useDateStore } from "../store/date-store"
import { FaChevronLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom'
import { deleteExerciseById, editExercise, markWorkoutUnsynced} from '../indexed_db/crud'
import EditExerciseCard from "../components/EditExerciseCard";
import { syncServerWithIDB } from '../supabase/supabaseDB'
import {useRenderWorkoutOnScreenStore} from '../store/render-workout-store'
import Header from '../components/Header'
import styles from './EditExercisePage.module.css'

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
            <Header 
                title={<p className={styles.title} style={{marginLeft: '50px'}}>Edit Exercise</p>}
                leftButton={<button className={styles.headerBtn} onClick={handleExitEditPage}><FaChevronLeft size={16} color="black"/></button>}
                rightButton={<button className={styles.saveBtn} onClick={handleSave}>Save</button>}
            />
            <main style={{overflowY: 'auto'}}>
                <div className={styles.editExersisePage}>
                    <EditExerciseCard />
                </div>
            </main>     
        </div>
    )
}











