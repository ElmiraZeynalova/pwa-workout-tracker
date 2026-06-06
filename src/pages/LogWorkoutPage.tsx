import { NavLink, useNavigate } from "react-router-dom"
import {useState} from 'react'
import { useWorkoutStore} from "../store/workout-store"
import { useDateStore } from "../store/date-store"
import {saveWorkout} from '../indexed_db/crud'
import LoggingExerciseCard from "../components/LoggingExerciseCard"
import { FaChevronLeft } from "react-icons/fa";
import dumbbellIcon from "../assets/grey_dumbbell.svg"
import { AiOutlinePlus } from "react-icons/ai";
import * as Dialog from '@radix-ui/react-dialog';
import { syncServerWithIDB } from '../supabase/supabaseDB'
import {useRenderWorkoutOnScreenStore} from '../store/render-workout-store'
import Header from "../components/Header"
import styles from './LogWorkoutPage.module.css'
type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}
export default function LogWorkoutPage(){
    const addExercises = useRenderWorkoutOnScreenStore((state) => state.addExercises)
    const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
    const currentWorkoutDate = useDateStore((state) => state.selectedDate)
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout)
    const navigate = useNavigate()
    const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
    const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

    const exercisesCards = currentWorkoutExercises.map(exercise => {
        return <LoggingExerciseCard key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
    })

    const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === 0 || s.reps === null))
    const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

    async function handleFinish(){
        if(exercisesCards.length > 0 && isValid){
            const cleanedExercises: Exercise[] = currentWorkoutExercises
              .map(e => ({
                  ...e, sets: e.sets
                          .filter(s => s.checked === true)
                          .map(s => ({setId: s.setId, reps: s.reps, weight: s.weight}))
                          .map(s => s.weight === null ? {...s, weight: 0} : s)
                          .filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)


            try {
                addExercises(currentWorkoutDate, cleanedExercises)
                navigate("/")
                await saveWorkout(currentWorkoutDate, cleanedExercises, 0)
                clearWorkoutStore()
                syncServerWithIDB().catch(console.error)

            } catch (error) {
                console.error(error)
            }

        } else {
            setShowFinishModal(true)
        }
    }

    function handleDiscard(){
        clearWorkoutStore()
        navigate("/")
    }
    
    return(
        <>
            <Dialog.Root open={showDiscardModal} onOpenChange={setShowDiscardModal}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} /> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className={styles.logWrktScreenModal}>
                        <p>Are you sure you want to discard this workout?</p>
                        <div className={styles.discardBtn} onClick={handleDiscard}>Discard workout</div>
                        <div className={styles.cancelBtn} onClick={() => setShowDiscardModal(false)}>Cancel</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>
        
            <Dialog.Root open={showFinishModal} onOpenChange={setShowFinishModal}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay}/> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className={styles.logWrktScreenModal}>
                    {exercisesCards.length === 0 && <p>Add an exercise</p>}
                    {(exercisesCards.length > 0 && notValid) && <p>Your workout has no set values</p>}
                    <div className={styles.okBtn} onClick={() => setShowFinishModal(false)}>Ok</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>

            <div className="layout">
                <Header 
                    title={<p className={styles.title} style={{marginLeft: '50px'}}>Log Workout</p>}
                    leftButton={<button className={styles.headerBtn} onClick={() => setShowDiscardModal(true)}><FaChevronLeft size={16} color="black"/></button>}
                    rightButton={<button className={styles.finishBtn} onClick={handleFinish}>Finish</button>}
                />
                <main style={{overflowY: 'auto'}}>
                        {exercisesCards.length > 0 && <div className={styles.logScreenWithExercisesAdded}>
                            {exercisesCards}
                            <NavLink to="/workouts/new/exercises" className={styles.addExerciseBtnLogScreen}>
                                <AiOutlinePlus size={22} color="white"/>
                                Add Exercise
                            </NavLink>
                        </div>}

                        {exercisesCards.length === 0 && <div className={styles.noExercisesLogScreen}>
                                <img src={dumbbellIcon} alt="dumbbell icon" width={70} height={70}/>
                                <h1>Get started</h1>
                                <p>Add an exercise to start your workout</p>
                                <NavLink to="/workouts/new/exercises" className={styles.addExerciseBtnLogScreen}>
                                    <AiOutlinePlus size={22} color="white"/>
                                    Add Exercise
                                </NavLink>
                        </div>}


                </main>     
            </div>
        </>  
    )
}











