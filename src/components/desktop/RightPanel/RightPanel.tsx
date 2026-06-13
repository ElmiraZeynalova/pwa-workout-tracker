import styles from './RightPanel.module.css'
import Calendar from '../Calendar/Calendar'
export default function RightArea(){
    return(
        <>
            <div className={styles.rightPanelLayout}>
                <Calendar/>
            </div> 
        </>
    )
}