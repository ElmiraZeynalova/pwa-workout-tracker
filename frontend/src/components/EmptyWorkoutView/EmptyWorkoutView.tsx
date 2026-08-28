import styles from "./EmptyWorkoutView.module.css"
import { useRenderDataOnScreenStore } from "../../store/render-data-store"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../utils/constants"
import RoutineCard from "../RoutineCard/RoutineCard"
import Button from "../Button/Button"
import dumbbellIcon from "../../assets/grey_dumbbell.svg"
import { Icon } from '@iconify/react'

export default function EmptyWorkoutView(){
    const routines = useRenderDataOnScreenStore(state => state.routines)
    const navigate = useNavigate()

    const routineCards = Object.values(routines)?.map((routine) => (
        <RoutineCard
            key={routine.routineId}
            routineId={routine.routineId}
            title={routine.title}
            exercises={routine?.exercises}
        />
    ))

    function handleCreateNewRoutineClick(){
        navigate(ROUTES.WORKOUTS_NEW_ROUTINES_NEW)
    }

    function handleAddExerciseClick(){
        navigate(ROUTES.WORKOUTS_NEW_EXERCISES)
    }

    return(
        <div className={styles.noExercisesLogScreen}>
            <div className={styles.newWorkoutContent}>
                <img src={dumbbellIcon} alt="dumbbell icon" width={50} height={50}/>
                <h1>Get started</h1>
                <p>Start adding exercises or choose routine to start your workout</p>
                <Button handleClick={handleAddExerciseClick} className={styles.addExerciseBtn} fill={true}>
                    <Icon icon="boxicons:plus" color="white" width={22} height={22}/>
                    Add Exercise
                </Button>

            </div>

            <div className={styles.routineContent}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h1>Routines</h1>
                    <button onClick={handleCreateNewRoutineClick} className={styles.createNewRoutineBtn}>
                        <Icon icon="boxicons:plus" color="#ff5526" width={20} height={20}/>
                        Create New
                    </button>
                </div>
                {routineCards}
            </div>
        </div>
    )
}