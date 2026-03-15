import { NavLink, useNavigate } from "react-router-dom"
import {useState} from 'react'
import { useWorkoutStore} from "../store/workout-store"
import { useDateStore } from "../store/date-store"
import { saveWorkout, deleteWorkoutByDate } from "../indexedDB"
import { syncToServer } from "../supabaseDB"
import Exercise from "./Exercise"
import clsx from 'clsx'

export default function LogWorkout(){

    const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
    const currentWorkoutDate = useDateStore((state) => state.selectedDate)
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout)
    const navigate = useNavigate()
    const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
    const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

    const exerciseCards = currentWorkoutExercises.map(exercise => {
        return <Exercise key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
    })

    const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === null))
    const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

// CHECK FOR VALID EMAIL FORM

// DESIGN SIGN IN PAGE
// DESIGN NO WORKOUT DAY
// DESIGN EXERCISES LIST PAGE

// DESIGN STATUS BAR

// стилизировать карточки логирования упражнений
// стилизировать карточки добавленніх упражнений
// разобраться с черной полоской на телефоне внизу

    async function handleFinish(){
        if(exerciseCards.length > 0 && isValid){
            const cleanedExercises = currentWorkoutExercises
                .map(e => ({
                    ...e, sets: e.sets.filter(s => s.reps !== null && s.reps > 0)
                }))
                .filter(e => e.sets.length > 0)

            await saveWorkout("workouts", currentWorkoutDate, cleanedExercises)
            console.log("Saved to IDB")
            await saveWorkout("pending_sync_to_server", currentWorkoutDate, cleanedExercises)
            clearWorkoutStore()
            navigate("/") 

            const { error } = await syncToServer(currentWorkoutDate)
            console.log("Synced with server")
            if(error) {
                console.warn("Sync failed", error)
            } else {
                await deleteWorkoutByDate("pending_sync_to_server", currentWorkoutDate)
                console.log("Deleted from pending")
            }
     
        }else{
            setShowFinishModal(true)
        }
    }

    function handleDiscard(){
        clearWorkoutStore()
        navigate("/")
    }
    
    return(
        <>
            {showDiscardModal && 
                <div className="modal-window">
                    <p>Are you sure you want to discard this workout?</p>
                    <button className="discard-btn" onClick={handleDiscard}>Discard Workout</button>
                    <button className="cancel-btn" onClick={() => setShowDiscardModal(false)}>Cancel</button>
                </div>
            }
        
            {showFinishModal && 
                <div className="modal-window">
                    {exerciseCards.length === 0 && <p>Add an exercise</p>}
                    {(exerciseCards.length > 0 && notValid) && <p>Your workout has no set values</p>}
    
                    <button className="ok-btn" onClick={() => setShowFinishModal(false)}>Ok</button>
                </div>
            }

            <div className={clsx("layout", (showDiscardModal || showFinishModal) && "modal-window-mode")}>
                <header>
                    <button className="header-btn" onClick={() => setShowDiscardModal(true)}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <p>Log Workout</p>
                    <button className="header-btn" onClick={handleFinish}>Finish</button>
                </header>
                <main style={{overflowY: 'auto', height: 0}}>
                    <div className="all-exercise-log-cards">
                        {exerciseCards.length > 0 && exerciseCards }

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
                    </div>
                </main>     
            </div>
        </>  
    )
}











