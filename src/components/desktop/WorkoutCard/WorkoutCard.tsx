import styles from './WorkoutCard.module.css'
import dumbbellIcon from "../../../assets/dumbbell.svg"
import dayjs from 'dayjs'

type SetInfo = {
    setId: string
    reps: number | null
    weight?: number | null
}

type Exercise = {
    exerciseId: string
    exerciseName: string
    sets: SetInfo[]
}

export default function WorkoutCard({date, exercises}: {date: string, exercises: Exercise[]}){

    const exercisesPerformed = exercises.map(e => {
        return <div key={e.exerciseId} className={styles.exercise}>
            <img src={dumbbellIcon} alt="exercise icon" width={45} height={45}/>
            <div className={styles.exerciseInfo}>
                <p className={styles.exerciseName}>{e.exerciseName}</p>
                <div className={styles.sets}>{e.sets.map((s, idx) => (
                    <div className={styles.set}>
                        <p className={styles.setIdx}>set {idx + 1}</p>
                        <p className={styles.setInfo}>{(s.weight !== null && s.weight !== 0) ? s.reps + " x " + s.weight + " kg" : s.reps + " reps"}</p>
                    </div>
                ))}</div>
            </div>
        </div>
    })

    return(
        <div className={styles.workoutCardLayout}>
            <div className={styles.top}>
                <h1>{dayjs(date).format("dddd, D MMMM")}</h1>
                <div className={styles.routineBadge}></div>
            </div>
            {exercisesPerformed}
        </div>
    )
}