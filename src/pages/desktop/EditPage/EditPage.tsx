import styles from './EditPage.module.css'
import DesktopLayout from '../../../layouts/DesktopLayout'
import RightPanel from '../../../components/desktop/RightPanel/RightPanel'
import ExercisesListPage from '../../ExerciseListPage/ExercisesListPage'
import MobileEditPage from '../../EditPage/EditPage'

export default function EditPage(){


    return(
        <DesktopLayout>
            <div className={styles.mainContent}>
                <MobileEditPage/>
            </div>
            <RightPanel>
                <ExercisesListPage/>
            </RightPanel>
        </DesktopLayout>
    )
}