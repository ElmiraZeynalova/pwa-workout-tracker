import styles from './ExerciseRoutineSetForm.module.css'

type Props = {
    idx: number
    reps: number | null
    weight?: number | null
    updateReps: (reps: number | null) => void
    updateWeight: (weight: number | null) => void
}

export default function ExerciseSetForm({idx, reps, weight, updateReps, updateWeight}: Props){

    return(
        <div className={styles.set}>
            {idx === 0 && <div className={styles.setHeaders}>
                <p>SET</p>
                <p>KG</p>
                <p>REPS</p>
            </div>}
            <div className={styles.setForm}>
                <p style={{fontWeight: 500, marginLeft: 10}}>{idx + 1}</p>
                <input  placeholder="0" value={weight || ''} type="number"  onChange={(e) => updateWeight(Number(e.target.value))}/>
                <input  placeholder="0" value={reps || ''} type="number"  onChange={(e) => updateReps(Number(e.target.value))}/>
                <div style={{width: 18}}></div>
            </div>  
        </div>
      

        )
}