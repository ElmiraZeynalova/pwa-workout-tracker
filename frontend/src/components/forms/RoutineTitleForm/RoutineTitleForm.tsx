
import { Icon } from '@iconify/react'
import styles from './RoutineTitleForm.module.css'
import { useExercisesStore } from '../../../store/exercises-store'

export default function RoutineTitleForm(){
    const title = useExercisesStore(state => state.routineTitle)
    const setTitle = useExercisesStore(state => state.setRoutineTitle)

    return(
        <form className={styles.routineForm}>
            <input 
                type="text"
                placeholder="Routine title"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            {title != "" && <Icon icon="system-uicons:cross" width={15} height={15} color="#656565" className={styles.crossBtn} onClick={() => setTitle("")}/>}
        </form>

    )
}