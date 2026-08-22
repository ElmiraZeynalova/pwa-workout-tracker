import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { useExercisesStore} from "../../store/exercises-store"
import { useDateStore } from "../../store/date-store"
import {saveWorkout} from '../../utils/indexed_db/workouts-store-crud'
import LoggingExerciseCard from '../../components/LoggingExerciseCard/LoggingExerciseCard'
import { FaChevronLeft } from "react-icons/fa";
import dumbbellIcon from '../../assets/grey_dumbbell.svg'
import { AiOutlinePlus } from "react-icons/ai";
import { syncServerWithIDB } from '../../utils/supabase/crud'
import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import Header from "../../components/Header/Header"
import styles from './LogWorkoutPage.module.css'
import RoutineCard from '../../components/RoutineCard/RoutineCard'
import Button from "../../components/Button/Button"
import { ROUTES } from "../../utils/constants"
import Modal from "../../components/Modal/Modal"
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
    const routines = useRenderDataOnScreenStore((state) => state.routines)
    const addExercises = useRenderDataOnScreenStore((state) => state.addExercises)
    const currentWorkoutExercises = useExercisesStore((state) => state.exercises)
    const currentWorkoutDate = useDateStore((state) => state.selectedDate)
    const clearExercisesStore = useExercisesStore((state) => state.clearStore)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showFinishModal, setShowFinishModal] = useState<boolean>(false)

    const exercisesCards = currentWorkoutExercises.map(exercise => {
        return <LoggingExerciseCard key={exercise.exerciseId} exerciseId={exercise.exerciseId} purpose="logWorkout"/>
    })

    const routineCards = Object.values(routines).map((routine) => (
        <RoutineCard
            key={routine.routineId}
            routineId={routine.routineId}
            title={routine.title}
            exercises={routine.exercises}
        />
    ))

    const notValid = currentWorkoutExercises.every(e => e.sets.every(s => s.reps === 0 || s.reps === null))
    const isValid = currentWorkoutExercises.some(e => e.sets.some(s => s.reps !== null && s.reps > 0))

    async function handleFinish(){
        if(exercisesCards.length > 0 && isValid){
            const cleanedExercises: Exercise[] = currentWorkoutExercises
              .map(e => ({
                  ...e, sets: e.sets
                          .filter(s => s.checked === true)
                          .map(s => ({setId: s.setId, reps: s.reps, weight: s.weight}))
                          .map(s => s.weight === null ? {...s, weight: 0} : s)
                          .filter(s => s.reps !== null && s.reps > 0)
              }))
              .filter(e => e.sets.length > 0)


            try {
                addExercises(currentWorkoutDate, cleanedExercises)
                navigate(ROUTES.HOME)
                await saveWorkout(currentWorkoutDate, cleanedExercises, 0)
                clearExercisesStore()
                syncServerWithIDB().catch(console.error)

            } catch (error) {
                console.error(error)
            }

        } else {
            setShowFinishModal(true)
        }
    }

    const modalWindowMessage = () => {
        if(exercisesCards.length === 0) return  "Add an exercise or choose routine" 
        else if(exercisesCards.length > 0 && notValid) return "Your workout has no set values"
    }

    function handleDiscard(){
        clearExercisesStore()
        navigate(ROUTES.HOME)
    }
    
    function handleAddExerciseClick(){
        navigate(ROUTES.WORKOUTS_NEW_EXERCISES)
    }

    function handleCreateNewRoutineClick(){
        navigate(ROUTES.WORKOUTS_NEW_ROUTINES_NEW)
    }

    function handleArrowClick(){
        if(currentWorkoutExercises.length > 0){
            setShowModal(true)
        }else{
            navigate(ROUTES.HOME)
        }
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

            <Modal open={showFinishModal} closeModal={() => setShowFinishModal(false)}>
                <Modal.Overlay/>
                <Modal.Container>
                    <Modal.Content>
                        <p className={styles.modalText}>{modalWindowMessage()}</p>
                        <Button className={styles.ok} handleClick={() => setShowFinishModal(false)} fill={true}>Ok</Button>
                    </Modal.Content>
                </Modal.Container>
            </Modal>


            <div className="mobile-layout">

                <Header>
                    <Header.LeftButton><button className={styles.headerBtn} onClick={handleArrowClick}><FaChevronLeft size={16} color="black"/></button></Header.LeftButton>
                    <Header.Title>Log Workout</Header.Title>
                    <Header.RightButton><Button handleClick={handleFinish} size="sm" fill={false}>Finish</Button></Header.RightButton>
                </Header>
                <main style={{overflowY: 'auto'}}>
                        {exercisesCards.length > 0 && <div className={styles.logScreenWithExercisesAdded}>
                            {exercisesCards}
                            <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                                <AiOutlinePlus size={22} color="white"/>
                                Add Exercise
                            </Button>
                        </div>}

                        {exercisesCards.length === 0 && <div className={styles.noExercisesLogScreen}>
                                <div className={styles.newWorkoutContent}>
                                    <img src={dumbbellIcon} alt="dumbbell icon" width={50} height={50}/>
                                    <h1>Get started</h1>
                                    <p>Start adding exercises or choose routine to start your workout</p>
                                    <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                                        <AiOutlinePlus size={22} color="white"/>
                                        Add Exercise
                                    </Button>

                                </div>


                                <div className={styles.routineContent}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <h1>Routines</h1>
                                        <button onClick={handleCreateNewRoutineClick} className={styles.createNewRoutineBtn}>
                                            <AiOutlinePlus size={20} color="##ff5526"/>
                                            Create New
                                        </button>
                                    </div>
                                    {routineCards}
                                </div>

                        </div>}
                </main>     
            </div>
        </>  
    )
}











