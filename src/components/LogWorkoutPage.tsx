import { NavLink, useNavigate } from "react-router-dom"
import {useState} from 'react'
import { useWorkoutStore} from "../zustand_store/workout-store"
import { useDateStore } from "../zustand_store/date-store"
import {saveWorkout} from '../indexed_db/crud'
import LogExerciseCard from "./LogExerciseCard"
import { FaChevronLeft } from "react-icons/fa";
import dumbbellIcon from "../assets/grey_dumbbell.svg"
import { AiOutlinePlus } from "react-icons/ai";
import * as Dialog from '@radix-ui/react-dialog';

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

    const currentWorkoutExercises = useWorkoutStore((state) => state.exercises)
    const currentWorkoutDate = useDateStore((state) => state.selectedDate)
    const clearWorkoutStore = useWorkoutStore((state) => state.clearWorkout)
    const navigate = useNavigate()
    const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
    const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

    const exercisesCards = currentWorkoutExercises.map(exercise => {
        return <LogExerciseCard key={exercise.exerciseId} exerciseId={exercise.exerciseId}/>
    })

    const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === 0 || s.reps === null))
    const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

    async function handleFinish(){
        if(exercisesCards.length > 0 && isValid){
            const cleanedExercises: Exercise[] = currentWorkoutExercises
              .map(e => ({
                  ...e, sets: e.sets
                          .filter(s => s.checked === true)
                          .flatMap(s => ({setId: s.setId, reps: s.reps, weight: s.weight}))
                          .flatMap(s => s.weight === null ? {...s, weight: 0} : s)
                          .filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)

            await saveWorkout(currentWorkoutDate, cleanedExercises, 0)
            console.log("Saved to IDB")
            clearWorkoutStore()
            navigate("/") 
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
            <Dialog.Root open={showDiscardModal} onOpenChange={setShowDiscardModal}>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay" /> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className="log-wrkt-screen-modal">
                        <p>Are you sure you want to discard this workout?</p>
                        <div className="discard-btn" onClick={handleDiscard}>Discard workout</div>
                        <div className="cancel-btn" onClick={() => setShowDiscardModal(false)}>Cancel</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>
        
            <Dialog.Root open={showFinishModal} onOpenChange={setShowFinishModal}>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay"/> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className="log-wrkt-screen-modal">
                    {exercisesCards.length === 0 && <p className="finish">Add an exercise</p>}
                    {(exercisesCards.length > 0 && notValid) && <p className="finish">Your workout has no set values</p>}
                    <div className="ok-btn" onClick={() => setShowFinishModal(false)}>Ok</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>

            <div className="layout">
                <header>
                    <button className="header-btn" onClick={() => setShowDiscardModal(true)}>
                        <FaChevronLeft size={16}/>
                    </button>
                    <p style={{marginLeft: '50px'}}>Log Workout</p>
                    <button className="finish-btn" onClick={handleFinish}>Finish</button>
                </header>

                <main style={{overflowY: 'auto'}}>

                        {exercisesCards.length > 0 && <div className="log-screen-with-exercises-added">
                            {exercisesCards}
                            <NavLink to="/workouts/new/exercises" className="add-exercise-btn-log-screen">
                                <AiOutlinePlus size={22} color="white"/>
                                Add Exercise
                            </NavLink>
                        </div>}

                        {exercisesCards.length === 0 && <div className="no-exercises-log-screen">
                                <img src={dumbbellIcon} alt="dumbbell icon" width={70} height={70}/>
                                <h1>Get started</h1>
                                <p>Add an exercise to start your workout</p>
                                <NavLink to="/workouts/new/exercises" className="add-exercise-btn-log-screen">
                                    <AiOutlinePlus size={22} color="white"/>
                                    Add Exercise
                                </NavLink>
                        </div>}


                </main>     
            </div>
        </>  
    )
}











