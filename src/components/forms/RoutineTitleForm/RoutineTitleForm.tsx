import { RxCross2 } from "react-icons/rx";
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
            {title != "" && <RxCross2 size={15} className={styles.crossBtn} color="#858585" onClick={() => setTitle("")}/>}
        </form>

    )
}