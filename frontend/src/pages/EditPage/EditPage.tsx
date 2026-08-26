import { useNavigate } from "react-router-dom"
import { useDateStore } from "../../store/date-store"
import { Icon } from '@iconify/react'
import { useLocation } from 'react-router-dom'
import { deleteExerciseById, editExercise, markWorkoutUnsynced} from '../../idb/workouts-store-crud'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import Header from '../../components/Header/Header'
import styles from './EditPage.module.css'
import LoggingExerciseCard from '../../components/LoggingExerciseCard/LoggingExerciseCard'
import { useExercisesStore } from "../../store/exercises-store";
import RoutineTitleForm from '../../components/forms/RoutineTitleForm/RoutineTitleForm'
import Button from "../../components/Button/Button";
import { deleteRoutineById, markRoutineUnsynced, editRoutine } from "../../idb/routines-store-crud";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ROUTES } from "../../utils/constants";
export default function EditPage(){
    const navigate = useNavigate()
    const { state } = useLocation()

    const isDesktop = useMediaQuery('(min-width: 1024px)')

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
                name: editingExercise.name,
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
        if(isDesktop){
            navigate(ROUTES.ROUTINES)
        }else{
            headerTitle === "Exercise" ? navigate(ROUTES.HOME) : navigate(ROUTES.WORKOUTS_NEW)
        }
    }

    function handleExitEditPage(){
        clearStore()
        isDesktop ? navigate(ROUTES.ROUTINES) : navigate('/')
    }
   
    function handleAddExerciseClick(){
        navigate(ROUTES.WORKOUTS_NEW_EXERCISES)
    }
    return(
        <div className="mobile-layout">
            <Header>
                <Header.LeftButton><button className={styles.headerBtn} onClick={handleExitEditPage}><Icon icon="boxicons:chevron-left" width={30} height={30} color="black" /></button></Header.LeftButton>
                <Header.Title>Edit {headerTitle}</Header.Title>
                <Header.RightButton><Button handleClick={handleSave} size="sm" fill={false}>Save</Button></Header.RightButton>
            </Header>
            <main style={{overflowY: 'auto'}}>
                <div className={styles.editPage}>
                    {headerTitle === "Routine" &&
                        <>
                            <RoutineTitleForm/>
                            {editingCardsForRoutine}
                            {!isDesktop && <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                                <Icon icon="boxicons:plus" color="white" width={22} height={22}/>
                                Add Exercise
                            </Button>}
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











