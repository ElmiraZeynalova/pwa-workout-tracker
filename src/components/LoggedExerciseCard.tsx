import { BsThreeDotsVertical } from "react-icons/bs";
import {useState} from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import dumbbellIcon from "../assets/dumbbell.svg"
import { useNavigate } from 'react-router-dom';
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import {deleteExerciseById, markWorkoutUnsynced} from '../indexed_db/crud'
import { syncServerWithIDB } from '../supabase/supabaseDB'
import {useRenderWorkoutOnScreenStore} from '../store/render-workout-store'
import styles from './LoggedExerciseCard.module.css'

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

export default function LoggedExerciseCard({exercise, date}: {exercise: Exercise, date: string}){
    const removeExercise = useRenderWorkoutOnScreenStore((state) => state.removeExercise)
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
        removeExercise(date, exercise.exerciseId)
        await deleteExerciseById(date, exercise.exerciseId)
        try {
            await markWorkoutUnsynced(date)
        } catch(e) {
            console.warn("Failed to mark workout unsynced:", e)
        }
        setShowModal(false)

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
                <Dialog.Overlay className={styles.overlay} /> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className={styles.editExrcModal}>
                    <div className={styles.modalActionBtns}>
                        <div className={styles.modalActionBtn} onClick={handleEditExr}>
                            <RiEditLine size={20} color="#8e8e8e"/>
                            Edit exercise</div>
                        <div className={styles.modalActionBtn} onClick={handleDeleteExr}>
                            <RiDeleteBinLine size={20} color="#8e8e8e"/>
                            Delete exercise</div>
                    </div>
                    <div className={styles.modalCancelBtn} onClick={() => setShowModal(false)}>Cancel</div>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>

            <div className={styles.loggedExerciseCard}>
                <div className={styles.top}>
                    <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                    <p className={styles.exerciseName}>{exercise.exerciseName}</p>
                    <BsThreeDotsVertical className={styles.menuBtn} onClick={() => setShowModal(true)} size={18} color='#FF5526'/>
                </div>
                <div className={styles.setRows}>
                    {sets.map(set => (
                        <div className={styles.setRow} key={set.id}>
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
