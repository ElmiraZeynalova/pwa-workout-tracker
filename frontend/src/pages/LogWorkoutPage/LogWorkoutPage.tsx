import { useNavigate } from "react-router-dom"
import {useState} from 'react'
import { useLocation } from "react-router-dom"
import { useExercisesStore} from "../../store/exercises-store"
import Header from "../../components/Header/Header"
import styles from './LogWorkoutPage.module.css'
import Button from "../../components/Button/Button"
import { ROUTES } from "../../utils/constants"
import Modal from "../../components/Modal/Modal"
import ActiveWorkoutView from "../../components/ActiveWorkoutView/ActiveWorkoutView"
import EmptyWorkoutView from "../../components/EmptyWorkoutView/EmptyWorkoutView"
import { useFinishWorkout } from "../../hooks/useFinishWorkout"
import { Icon } from '@iconify/react'

export default function LogWorkoutPage(){
    const clearExercisesStore = useExercisesStore((state) => state.clearStore)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState<boolean>(false)
    const [showFinishModal, setShowFinishModal] = useState<boolean>(false)
    const location = useLocation()
    const urlPath = location.pathname
    console.log(urlPath)
    const {isValid, notValid, finishWorkout, exercisesCount} = useFinishWorkout()
    
    async function handleFinish(){
        if(exercisesCount > 0 && isValid){
            try{
                await finishWorkout()
            }catch(error){
                console.error(error)
            }
        }else{
            setShowFinishModal(true)
        } 
    }

    const modalWindowMessage = () => {
        if(exercisesCount === 0) return  "Add an exercise or choose routine" 
        else if(exercisesCount > 0 && notValid) return "Your workout has no set values"
    }

    function handleDiscard(){
        clearExercisesStore()
        navigate(ROUTES.HOME)
    }

    function handleArrowClick(){
        if(exercisesCount > 0){
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


            <div className={styles.container}>
                {urlPath !== "/" && <Header>
                    <Header.LeftButton><button className={styles.headerBtn} onClick={handleArrowClick}><Icon icon="boxicons:chevron-left" width={30} height={30} color="black" /></button></Header.LeftButton>
                    <Header.Title>Log Workout</Header.Title>
                    {exercisesCount > 0 && <Header.RightButton><Button handleClick={handleFinish} size="sm" fill={false}>Finish</Button></Header.RightButton>}
                </Header>}

                <main className={styles.main}>
                    {exercisesCount > 0 
                    ? <ActiveWorkoutView/>
                    : <EmptyWorkoutView/>
                    }
                </main>
            </div>
        </>  
    )
}











