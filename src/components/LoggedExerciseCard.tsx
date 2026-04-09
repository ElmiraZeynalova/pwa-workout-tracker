import { BsThreeDotsVertical } from "react-icons/bs";
import {useState} from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import dumbbellIcon from "../assets/dumbbell.svg"
import { useNavigate } from 'react-router-dom';
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import {deleteExerciseById, markWorkoutUnsynced} from '../indexed_db/crud'
import { syncServerWithIDB } from '../supabaseDB'

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

export default function LoggedExerciseCard({exercise, date, onDelete}: {exercise: Exercise, date: string, onDelete: () => void}){
    const [showModal, setShowModal] = useState<boolean>(false)
    const navigate = useNavigate()
    const sets = exercise.sets.map((set, idx) => (
        {
            id: idx + 1,
            reps: set.reps,
            weight: set.weight
        }
    ))

    async function handleDeleteExr(){
        await deleteExerciseById(date, exercise.exerciseId)
        try {
            await markWorkoutUnsynced(date)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        setShowModal(false)
        onDelete()

        await syncServerWithIDB()
        console.log("Server is synced with IDB")
    }

    async function handleEditExr(){
        navigate("/exercises/edit", {state: { exerciseId: exercise.exerciseId }});
        setShowModal(false)
    }

    return(
        <>
            <Dialog.Root open={showModal} onOpenChange={setShowModal}>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay" /> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className="edit-exrc-modal">
                    <div className="modal-action-btns">
                        <div className="modal-action-btn" onClick={handleEditExr}>
                            <RiEditLine size={20} color="#8e8e8e"/>
                            Edit exercise</div>
                        <div className="modal-action-btn" onClick={handleDeleteExr}>
                            <RiDeleteBinLine size={20} color="#8e8e8e"/>
                            Delete exercise</div>
                    </div>
                    <div className="modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>

            <div className="logged-exercise-card">
                <div className="top">
                    <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                    <p className="exercise-name">{exercise.exerciseName}</p>
                    <BsThreeDotsVertical onClick={() => setShowModal(true)} size={18} color='#FF5526'/>
                </div>
                <div className="set-rows">
                    {sets.map(set => (
                        <div className="set-row" key={set.id}>
                            <span style={{width: 20}}>{set.id}</span>
                            <p>{set.weight} <span>kgs</span></p>
                            <p>{set.reps} <span>reps</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
