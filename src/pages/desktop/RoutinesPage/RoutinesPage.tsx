import styles from './RoutinesPage.module.css'
import DesktopLayout from '../../../layouts/DesktopLayout'
import { useRenderDataOnScreenStore } from '../../../store/render-data-store'
import RoutineCard from '../../../components/RoutineCard/RoutineCard'
import {NavLink} from 'react-router-dom'
import RightPanel from '../../../components/desktop/RightPanel/RightPanel'
import { AiOutlinePlus } from "react-icons/ai";

export default function RoutinesPage(){
    const routines = useRenderDataOnScreenStore(state => state.routines)
    const routineCards = Object.values(routines).map((routine) => (
        <RoutineCard
            key={routine.routineId}
            routineId={routine.routineId}
            title={routine.title}
            exercises={routine.exercises}
        />
        
    ))

    return(
        <DesktopLayout>
            <div className={styles.mainContent}>
                <h1>Routines</h1>
                {routineCards}
            </div>
            <RightPanel>
                <NavLink to='/routines/new' className={styles.createNewRoutineBtn}>
                    <AiOutlinePlus size={23} color="##ff5526"/>
                    New Routine
                </NavLink>
            </RightPanel>
        </DesktopLayout>
    )
}