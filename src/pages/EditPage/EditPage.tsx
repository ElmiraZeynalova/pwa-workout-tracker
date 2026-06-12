import { useNavigate } from "react-router-dom"
import { useDateStore } from "../../store/date-store"
import { FaChevronLeft } from "react-icons/fa";
import { useLocation } from 'react-router-dom'
import { deleteExerciseById, editExercise, markWorkoutUnsynced} from '../../indexed_db/workouts-store-crud'
import { syncServerWithIDB } from '../../supabase/supabase_crud'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import Header from '../../components/Header/Header'
import styles from './EditPage.module.css'
import EmptyButton from "../../components/buttons/EmptyButton/EmptyButton"
import LoggingExerciseCard from '../../components/LoggingExerciseCard/LoggingExerciseCard'
import { useExercisesStore } from "../../store/exercises-store";
import RoutineTitleForm from '../../components/forms/RoutineTitleForm/RoutineTitleForm'
import { AiOutlinePlus } from "react-icons/ai";
import FilledButton from "../../components/buttons/FilledButton/FilledButton"
import { deleteRoutineById, markRoutineUnsynced, editRoutine } from "../../indexed_db/routines-store-crud";

export default function EditPage(){
    const navigate = useNavigate()
    const { state } = useLocation()

    const exerciseId = state.exerciseId
    const headerTitle = state.headerTitle
    const routineId = state.routineId

    const routineTitle = useExercisesStore(state => state.routineTitle)
    const editingExercise = useExercisesStore(state => state.exercises.find(e => e.exerciseId === exerciseId))
    const editingRoutineExercises = useExercisesStore(state => state.exercises)
    const clearStore = useExercisesStore(state => state.clearStore)
    const workoutDate = useDateStore(state => state.selectedDate)
    const removeExercise = useRenderDataOnScreenStore((state) => state.removeExercise)
    const updateExercise = useRenderDataOnScreenStore((state) => state.updateExercise)
    const removeRoutine = useRenderDataOnScreenStore(state => state.removeRoutine)
    const updateRoutine = useRenderDataOnScreenStore(state => state.updateRoutine)
    const editingCardsForRoutine = editingRoutineExercises.map(e => <LoggingExerciseCard key={e.exerciseId} exerciseId={e.exerciseId} purpose="routine"/>)

    async function handleSave(){
        if(headerTitle === "Exercise"){
            if(!editingExercise) return
            const cleanExerciseData = {
                exerciseId: exerciseId,
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
        }else{
            if(editingRoutineExercises.length === 0) {
                removeRoutine(routineId) 
                await deleteRoutineById(routineId)
            }else{
                updateRoutine(routineId, routineTitle, editingRoutineExercises)
                await editRoutine(routineId, routineTitle, editingRoutineExercises) 
            }
            try {
                await markRoutineUnsynced(routineId)
            } catch(e) {
                console.warn("Failed to mark routine unsynced:", e)
            }

        }

        clearStore()
        headerTitle === "Exercise" ? navigate('/') : navigate('/workouts/new')
        syncServerWithIDB().catch(console.warn)
    }

    function handleExitEditPage(){
        clearStore()
        navigate('/')
    }
   
    function handleAddExerciseClick(){
        navigate("/workouts/new/exercises")
    }
    return(
        <div className="mobile-layout">
            <Header 
                title={<p className={styles.title} style={{marginLeft: '50px'}}>Edit {headerTitle}</p>}
                leftButton={<button className={styles.headerBtn} onClick={handleExitEditPage}><FaChevronLeft size={16} color="black"/></button>}
                rightButton={<EmptyButton handleClick={handleSave} size="sm">Save</EmptyButton>}
            />
            <main style={{overflowY: 'auto'}}>
                <div className={styles.editPage}>
                    {headerTitle === "Routine" &&
                        <>
                            <RoutineTitleForm/>
                            {editingCardsForRoutine}
                            <FilledButton handleClick={handleAddExerciseClick} className={styles.addExerciseBtn}>
                                <AiOutlinePlus size={22} color="white"/>
                                Add Exercise
                            </FilledButton>
                        </>
                    }

                    {headerTitle === "Exercise" &&
                        <LoggingExerciseCard key={exerciseId} exerciseId={exerciseId} purpose="logWorkout"/> 
                    }
                </div>
            </main>     
        </div>
    )
}











