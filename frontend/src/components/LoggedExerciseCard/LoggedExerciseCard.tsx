import { BsThreeDotsVertical } from "react-icons/bs";
import {useState} from 'react'
import dumbbellIcon from '../../assets/dumbbell.svg'
import { useNavigate } from 'react-router-dom';
import {deleteExerciseById, markWorkoutUnsynced} from '../../idb/workouts-store-crud'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import styles from './LoggedExerciseCard.module.css'
import Modal from "../Modal/Modal";
import { useExercisesStore } from '../../store/exercises-store'
import { ROUTES } from "../../utils/constants";
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import type { Exercise} from "../../types";


export default function LoggedExerciseCard({exercise, date}: {exercise: Exercise, date: string}){
    const removeExercise = useRenderDataOnScreenStore((state) => state.removeExercise)
    const [showModal, setShowModal] = useState<boolean>(false)
    const navigate = useNavigate()
    const addNewExerciseToStore = useExercisesStore(state => state.addNewFullExercises)
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

    }

    async function handleEditExr(){
        const formattedSets = exercise.sets.map(s => ({...s, checked: true}))
        const formattedExercise = {...exercise, sets: formattedSets }
        addNewExerciseToStore([formattedExercise])
        navigate(ROUTES.EXERCISES_EDIT, {state: { headerTitle: "Exercise", exerciseId: exercise.exerciseId}});
        setShowModal(false)
    }

    return(
        <>

            <Modal open={showModal} closeModal={() => setShowModal(false)}>
                <Modal.Overlay/>
                <Modal.Container className={styles.modalContainer}>
                    <Modal.Content>
                        <div className={styles.modalActionBtns}>
                            <button className={styles.modalActionBtn} onClick={() => handleEditExr()}>
                                <RiEditLine size={20} color="#8e8e8e"/>
                                Edit exercise</button>
                            <button className={styles.modalActionBtn} onClick={() => handleDeleteExr()}>
                                <RiDeleteBinLine size={20} color="#8e8e8e"/>
                                Delete exercise</button>
                        </div>
                        <button className={styles.modalCancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <div className={styles.loggedExerciseCard}>
                <div className={styles.top}>
                    <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
                    <p className={styles.exerciseName}>{exercise.name}</p>
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
