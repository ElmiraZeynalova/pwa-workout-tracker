import styles from './RoutineCard.module.css'
import { BsThreeDotsVertical } from "react-icons/bs";
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useExercisesStore } from "../../store/exercises-store";
import { useRenderDataOnScreenStore } from '../../store/render-data-store';
import { deleteRoutineById} from '../../lib/indexed_db/routines-store-crud';
import { syncServerWithIDB, deleteRoutineFromServer } from '../../lib/supabase/crud'
import { useMediaQuery } from '../../hooks/useMediaQuery';
import dumbbellIcon from '../../assets/dumbbell.svg'
import { ROUTES } from '../../lib/constants';
import { RiEditLine } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
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

type Props = {
    routineId: string
    title: string
    exercises: Exercise[]
}

export default function RoutineCard({ routineId, title, exercises}: Props) {
    const [showModal, setShowModal] = useState<boolean>(false)
    const navigate = useNavigate()
    const addNewExerciseToStore = useExercisesStore(state => state.addNewFullExercises)
    const setRoutineTitle = useExercisesStore(state => state.setRoutineTitle)
    const removeRoutine = useRenderDataOnScreenStore(state => state.removeRoutine)

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    function handleStartRoutineClick(){
        addNewExerciseToStore(exercises)
        navigate(ROUTES.WORKOUTS_NEW)
    }

    async function handleDeleteRoutine(){
        removeRoutine(routineId)
        await deleteRoutineById(routineId)
        try {
            await deleteRoutineFromServer(routineId)
        } catch(e) {
            console.warn("Failed to delete routine from server:", e)
        }
        setShowModal(false)
        syncServerWithIDB().catch(console.warn)

    }

    function handleEditRoutine(){
        setRoutineTitle(title)
        addNewExerciseToStore(exercises)
        navigate(ROUTES.ROUTINES_EDIT, {state: { headerTitle: "Routine", routineId: routineId, routineTitle: title}})
        setShowModal(false)
    }

    const exercisesPerformed = exercises.map(e => {
        return <div key={e.exerciseId} className={styles.exercise}>
            <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
            <div className={styles.exerciseInfo}>
                <p className={styles.exerciseName}>{e.exerciseName}</p>
                <div className={styles.sets}>{e.sets.map((s, idx) => (
                    <div key={s.setId} className={styles.set}>
                        <p className={styles.setIdx}>set {idx + 1}</p>
                        <p className={styles.setInfo}>{(s.weight !== null && s.weight !== 0) ? s.reps + " x " + s.weight + " kg" : s.reps + " reps"}</p>
                    </div>
                ))}</div>
            </div>
        </div>
    })
    return (
        <>
            <Modal open={showModal} closeModal={() => setShowModal(false)}>
                <Modal.Overlay/>
                <Modal.Container className={styles.modalContainer}>
                    <Modal.Content>
                        <div className={styles.modalActionBtns}>
                            <button className={styles.modalActionBtn} onClick={() => handleEditRoutine()}>
                                <RiEditLine size={20} color="#8e8e8e"/>
                                Edit exercise</button>
                            <button className={styles.modalActionBtn} onClick={() => handleDeleteRoutine()}>
                                <RiDeleteBinLine size={20} color="#8e8e8e"/>
                                Delete exercise</button>
                        </div>
                        <button className={styles.modalCancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>
            <div className={styles.routineCard}>
                <div className={styles.top}>
                    <h1>{title}</h1>
                    <BsThreeDotsVertical className={styles.menuBtn} onClick={() => setShowModal(true)} size={18} color='#FF5526'/>
                </div>
                {isDesktop ? exercisesPerformed : <p>{exercises.map(e => e.exerciseName).join(', ')}</p>}
                {!isDesktop && <Button handleClick={handleStartRoutineClick} size="sm" className={styles.startRoutineBtn} fill={false}>Start Routine</Button>}
            </div>
        </>
    )
}