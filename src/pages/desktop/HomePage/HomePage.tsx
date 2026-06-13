import RightPanel from '../../../components/desktop/RightPanel/RightPanel'
import styles from './HomePage.module.css'
import DesktopLayout from '../../../layouts/DesktopLayout'
import { useDateStore } from '../../../store/date-store'
import { useRenderDataOnScreenStore } from '../../../store/render-data-store'
import dayjs from 'dayjs'
import WorkoutCard from '../../../components/desktop/WorkoutCard/WorkoutCard'

export default function HomePage(){
        const selectedDate = useDateStore(state => state.selectedDate)
        const currentMonth = dayjs(selectedDate).month()
        const currentYear = dayjs(selectedDate).year()
        const allWorkouts = useRenderDataOnScreenStore(state => state.workouts)
        const currentMonthWorkouts = Object.values(allWorkouts).filter(w => dayjs(w.date).month() === currentMonth && dayjs(w.date).year() === currentYear)
       
        const workoutCards = currentMonthWorkouts.map(w => <WorkoutCard key={w?.date} date={w?.date} exercises={w?.exercises}/>)
    return(
        <DesktopLayout>
            <div className={styles.mainContent}>
                <h1>{dayjs(selectedDate).format("MMMM YYYY")}</h1>
                {workoutCards}
                {workoutCards.length === 0 && <p className={styles.noWorkouts}>Workout Log Is Empty</p>}
            </div>
            <RightPanel/>
        </DesktopLayout>
    )
}