import clsx from 'clsx'
import styles from './ExerciseSetForm.module.css'
import { Icon } from '@iconify/react'

type Props = {
    idx: number
    checked?: boolean
    onToggle: () => void
    reps: number | null
    weight?: number | null
    deleteSet: () => void
    updateReps: (reps: number | null) => void
    updateWeight: (weight: number | null) => void
}
export default function ExerciseSetForm({idx, checked, onToggle, reps, weight, deleteSet, updateReps, updateWeight}: Props){

    return(
        <div className={styles.set}>
            {idx === 0 && <div className={styles.setHeaders}>
                <p>SET</p>
                <p>KG</p>
                <p>REPS</p>
                <Icon icon="fluent-mdl2:check-mark" color="#858585" width={20} height={20} />
                <div/>
            </div>}
            <div className={styles.setForm}>
                <p>{idx + 1}</p>
                <input  placeholder="0" value={weight || ''} type="number"  onChange={(e) => updateWeight(Number(e.target.value))}/>
                <input  placeholder="0" value={reps || ''} type="number"  onChange={(e) => updateReps(Number(e.target.value))}/>
                <div className={clsx(styles.checkbox, checked && styles.checked)} onClick={onToggle}>
                    {checked && <Icon icon="fluent-mdl2:check-mark" color="white" width={16} height={16} />}
                </div>
                <Icon icon="system-uicons:cross" width={18} height={18} color="#858585" className={styles.crossBtn} onClick={deleteSet} />  
            </div>  
        </div>
      

        )
}