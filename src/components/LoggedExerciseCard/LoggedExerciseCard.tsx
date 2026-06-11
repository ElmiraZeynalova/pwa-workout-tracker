import { BsThreeDotsVertical } from "react-icons/bs";
import {useState} from 'react'
import dumbbellIcon from '../../assets/dumbbell.svg'
import { useNavigate } from 'react-router-dom';
import {deleteExerciseById, markWorkoutUnsynced} from '../../indexed_db/workouts-store-crud'
import { syncServerWithIDB } from '../../supabase/supabaseDB'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import styles from './LoggedExerciseCard.module.css'
import EditModalWindow from '../modal-windows/EditModalWindow/EditModalWindow'
import { useExercisesStore } from '../../store/exercises-store'

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

        await syncServerWithIDB()
        console.log("Server is synced with IDB")
    }

    async function handleEditExr(){
        const formattedSets = exercise.sets.map(s => ({...s, checked: true}))
        const formattedExercise = {...exercise, sets: formattedSets }
        addNewExerciseToStore([formattedExercise])
        navigate("/exercises/edit", {state: { headerTitle: "Exercise", exerciseId: exercise.exerciseId}});
        setShowModal(false)
    }

    return(
        <>
            <EditModalWindow showModal={showModal} setShowModal={() => setShowModal(!showModal)} btnText1="Edit exercise" btnText2="Delete exercise" handleDelete={handleDeleteExr} handleEdit={handleEditExr}/>

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
