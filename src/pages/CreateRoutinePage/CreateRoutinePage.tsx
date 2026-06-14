import Header from '../../components/Header/Header'
import styles from './CreateRoutinePage.module.css'
import {useNavigate} from 'react-router-dom'
import { FaChevronLeft } from "react-icons/fa"
import { AiOutlinePlus } from "react-icons/ai"
import dumbbellIcon from '../../assets/grey_dumbbell.svg'
import { useExercisesStore } from '../../store/exercises-store'
import LoggingExerciseCard from '../../components/LoggingExerciseCard/LoggingExerciseCard'
import {saveRoutine} from '../../indexed_db/routines-store-crud'
import {useState} from 'react'
import { useRenderDataOnScreenStore } from '../../store/render-data-store'
import DiscardModalWindow from '../../components/modal-windows/DiscardModalWindow/DiscardModalWindow'
import MessageModalWindow from '../../components/modal-windows/MessageModalWindow/MessageModalWindow'
import FilledButton from "../../components/buttons/FilledButton/FilledButton"
import EmptyButton from '../../components/buttons/EmptyButton/EmptyButton'
import RoutineTitleForm from '../../components/forms/RoutineTitleForm/RoutineTitleForm'
import { syncServerWithIDB } from '../../supabase/supabase_crud'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function CreateRoutinePage(){
    const setRoutine = useRenderDataOnScreenStore((state) => state.setRoutine)
    const routineExercises = useExercisesStore((state) => state.exercises)
    const clearExercisesStore = useExercisesStore((state) => state.clearStore)
    const navigate = useNavigate()

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    const title = useExercisesStore(state => state.routineTitle)
    const setTitle = useExercisesStore(state => state.setRoutineTitle)

    const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false)
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false)

    async function handleSave(){
        if(routineExercises.length > 0 && title.length > 0){
            const routineId = crypto.randomUUID()
            try {
                setRoutine(routineId, title, routineExercises)
                isDesktop ? navigate("/routines") : navigate("/workouts/new")
                await saveRoutine(routineId, title, routineExercises, 0)
                clearExercisesStore()
                setTitle("")
                syncServerWithIDB().catch(console.error)

            } catch (error) {
                console.error(error)
            }

        } else if(title.length === 0 || routineExercises.length === 0) {
            setShowSaveModal(true)
        }
    }

    const modalWindowMessage = title.length === 0 && routineExercises.length === 0 ? "Add data to routine" : 
        title.length === 0 ? "Add title" : "Add exercises"

    function handleDiscard(){
        setTitle("")
        clearExercisesStore()
        isDesktop ? navigate("/routines") : navigate("/workouts/new")
    } 

    function handleAddExerciseClick(){
        navigate("/workouts/new/routines/new/exercises")
    }
    return(
        <>
            <DiscardModalWindow showModal={showDiscardModal} setShowModal={() => setShowDiscardModal(!showDiscardModal)} handleDiscard={handleDiscard} message="Are you sure you want to discard this routine?" btnText="Discard routine"/>
            <MessageModalWindow showModal={showSaveModal} setShowModal={() => setShowSaveModal(!showSaveModal)} text={modalWindowMessage}/>

            <div className="mobile-layout">
                <Header 
                    title={<p className={styles.title} style={{marginLeft: '50px'}}>Create Routine</p>}
                    leftButton={<button className={styles.headerBtn} onClick={() => setShowDiscardModal(true)}><FaChevronLeft size={16} color="black"/></button>}
                    rightButton={<EmptyButton handleClick={handleSave} size="sm">Save</EmptyButton>}
                />
                <main style={{overflowY: 'auto'}}>
                    <div className={styles.createRoutineScreenLayout}>
                        <RoutineTitleForm />

                        {routineExercises.length === 0 &&
                            <div className={styles.noExercisesAddedToRoutine}>
                                <img src={dumbbellIcon} alt="dumbbell icon" width={50} height={50}/>
                                <h1>No exercises</h1>
                                <p>Get started by adding exercises to your routine</p>
                            </div>
                        }
                        {routineExercises.map(exercise => {
                            return <LoggingExerciseCard key={exercise.exerciseId} exerciseId={exercise.exerciseId} purpose="routine"/>
                        })}
                        {!isDesktop && <FilledButton handleClick={handleAddExerciseClick} className={styles.addExerciseBtn}>
                            <AiOutlinePlus size={22} color="white"/>
                            Add Exercise
                        </FilledButton>}
                    </div>
                </main>
            </div>
        </>
    )
}