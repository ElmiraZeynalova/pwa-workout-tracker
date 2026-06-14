import RightPanel from '../../../components/desktop/RightPanel/RightPanel'
import MobileCreateRoutinePage from '../../CreateRoutinePage/CreateRoutinePage'
import styles from './CreateRoutinePage.module.css'
import DesktopLayout from '../../../layouts/DesktopLayout'
import ExercisesListPage from '../../ExerciseListPage/ExercisesListPage'
export default function CreateRoutinePage(){

    return(
        <DesktopLayout>
            <div className={styles.mainContent}>
                <MobileCreateRoutinePage desktop={true}/>
            </div>
            <RightPanel>
                <ExercisesListPage desktop={true}/>
            </RightPanel>
        </DesktopLayout>
    )
}