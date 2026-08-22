import Header from '../../components/Header/Header'
import styles from './CreateRoutinePage.module.css'
import {useNavigate} from 'react-router-dom'
import { FaChevronLeft } from "react-icons/fa"
import { AiOutlinePlus } from "react-icons/ai"
import dumbbellIcon from '../../assets/grey_dumbbell.svg'
import { useExercisesStore } from '../../store/exercises-store'
import LoggingExerciseCard from '../../components/LoggingExerciseCard/LoggingExerciseCard'
import {saveRoutine} from '../../utils/indexed_db/routines-store-crud'
import {useState} from 'react'
import { useRenderDataOnScreenStore } from '../../store/render-data-store'

import Modal from '../../components/Modal/Modal'
import Button from '../../components/Button/Button'
import RoutineTitleForm from '../../components/forms/RoutineTitleForm/RoutineTitleForm'
import { syncServerWithIDB } from '../../utils/supabase/crud'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { ROUTES } from '../../utils/constants'

export default function CreateRoutinePage(){
    const setRoutine = useRenderDataOnScreenStore((state) => state.setRoutine)
    const routineExercises = useExercisesStore((state) => state.exercises)
    const clearExercisesStore = useExercisesStore((state) => state.clearStore)
    const navigate = useNavigate()

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    const title = useExercisesStore(state => state.routineTitle)
    const setTitle = useExercisesStore(state => state.setRoutineTitle)

    const [showModal, setShowModal] = useState<boolean>(false)
    const [showSaveModal, setShowSaveModal] = useState<boolean>(false)

    async function handleSave(){
        if(routineExercises.length > 0 && title.length > 0){
            const routineId = crypto.randomUUID()
            try {
                setRoutine(routineId, title, routineExercises)
                isDesktop ? navigate(ROUTES.ROUTINES) : navigate(ROUTES.WORKOUTS_NEW)
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
        isDesktop ? navigate(ROUTES.ROUTINES) : navigate(ROUTES.WORKOUTS_NEW)
    } 

    function handleAddExerciseClick(){
        navigate(ROUTES.WORKOUTS_NEW_ROUTINES_NEW_EXERCISES)
    }
    return(
        <>
            <Modal open={showModal} closeModal={() => setShowModal(false)}>
                <Modal.Overlay/>
                <Modal.Container>
                    <Modal.Content>
                        <p className={styles.modalText}>Are you sure you want to discard this workout?</p>
                        <Button className={styles.discardBtn} handleClick={handleDiscard} fill={true}>Discard workout</Button>
                        <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <Modal open={showSaveModal} closeModal={() => setShowSaveModal(false)}>
                <Modal.Overlay/>
                <Modal.Container>
                    <Modal.Content>
                        <p className={styles.modalText}>{modalWindowMessage}</p>
                        <Button className={styles.ok} handleClick={() => setShowSaveModal(false)} fill={true}>Ok</Button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>

            <div className="mobile-layout">
                <Header>
                    <Header.LeftButton><button className={styles.headerBtn} onClick={() => setShowModal(true)}><FaChevronLeft size={16} color="black"/></button></Header.LeftButton>
                    <Header.Title>Create Routine</Header.Title>
                    <Header.RightButton><Button handleClick={handleSave} size="sm" fill={false}>Save</Button></Header.RightButton>
                </Header>
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
                        {!isDesktop && <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                            <AiOutlinePlus size={22} color="white"/>
                            Add Exercise
                        </Button>}
                    </div>
                </main>
            </div>
        </>
    )
}