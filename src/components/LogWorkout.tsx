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
// MAKE SUPABASE -> IDB "WORKOUTS" SYNC
// DESIGN STATUS BAR
    async function handleFinish(){
        if(exerciseCards.length > 0 && isValid){
            const cleanedExercises = currentWorkoutExercises
                .map(e => ({
                    ...e, sets: e.sets.filter(s => s.reps !== null && s.reps > 0)
                }))
                .filter(e => e.sets.length > 0)

            await saveWorkout("workouts", currentWorkoutDate, cleanedExercises)
            await saveWorkout("pending_sync_to_server", currentWorkoutDate, cleanedExercises)
            clearWorkoutStore()
            navigate("/") 

            const { error } = await syncToServer(currentWorkoutDate)
            if(error) {
                console.warn("Sync failed", error)
            } else {
                await deleteWorkoutByDate("pending_sync_to_server", currentWorkoutDate)
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
    <div className={clsx("log-workout-layout", (showDiscardModal || showFinishModal) && "modal-window-mode")}>
   
        <div className="navigation-bar">
            <button className="go-home-btn" onClick={() => setShowDiscardModal(true)}>
                <svg fill="#757575" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" enableBackground="new 0 0 100 100" stroke="#757575"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M33.934,54.458l30.822,27.938c0.383,0.348,0.864,0.519,1.344,0.519c0.545,0,1.087-0.222,1.482-0.657 c0.741-0.818,0.68-2.083-0.139-2.824L37.801,52.564L64.67,22.921c0.742-0.818,0.68-2.083-0.139-2.824 c-0.817-0.742-2.082-0.679-2.824,0.139L33.768,51.059c-0.439,0.485-0.59,1.126-0.475,1.723 C33.234,53.39,33.446,54.017,33.934,54.458z"></path> </g> </g></svg>
                <span>Log Workout</span>
            </button>
            <button className="finish-btn" onClick={handleFinish}>Finish</button>
        </div>
        
        {showDiscardModal && 
            <div className="discard-modal-window">
                <p>Are you sure you want to discard this workout?</p>
                <button className="discard-btn" onClick={handleDiscard}>Discard Workout</button>
                <button className="cancel-btn" onClick={() => setShowDiscardModal(false)}>Cancel</button>
            </div>
        }
        
        {showFinishModal && 
            <div className="finish-modal-window">
                {exerciseCards.length === 0 && <p>Add an exercise</p>}
                {(exerciseCards.length > 0 && notValid) && <p>Your workout has no set values</p>}
 
                <button className="ok-btn" onClick={() => setShowFinishModal(false)}>Ok</button>
            </div>
        }

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

    </div>
        
    )
}











