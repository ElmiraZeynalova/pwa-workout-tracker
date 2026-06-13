import styles from './RoutinesPage.module.css'
import DesktopLayout from '../../../layouts/DesktopLayout'
export default function RoutinesPage(){
    return(
        <DesktopLayout>
            <div className={styles.mainContent}>
                <h1>Routines</h1>
            </div>
        </DesktopLayout>
    )
}