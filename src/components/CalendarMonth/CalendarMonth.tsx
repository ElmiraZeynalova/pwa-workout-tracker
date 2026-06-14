import {useRenderDataOnScreenStore} from '../../store/render-data-store'
import dayjs from "dayjs"
import clsx from 'clsx'
import styles from './CalendarMonth.module.css'
import { useMediaQuery } from '../../hooks/useMediaQuery'
interface Props {
  monthName: string
  dates: string[]
  offset: number
  selectedDate: string
  onSelectedDate: (date: string) => void
  toggleShowWorkoutSummary?: (status: boolean) => void
}

export default function CalendarMonth({ monthName, dates, offset, selectedDate, onSelectedDate, toggleShowWorkoutSummary}: Props){
    const workouts = useRenderDataOnScreenStore((state) => state.workouts)
    const isDesktop = useMediaQuery('(min-width: 1024px)')
    function handleDateChoice(date: string){
        onSelectedDate(date)
        toggleShowWorkoutSummary?.(true)

    }

    return(
        <div className={styles.month}>
            { !isDesktop && <h1>{monthName}</h1>}
            <div className={styles.dates}>
                {Array.from({ length: offset }, (_, i) => (
                    <div key={`empty-${i}`} className={styles.date} />
                ))}
                {dates.map(date => (
                    <div key={date} className={styles.date}>
                        <span className={styles.todayLabel}>
                            {dayjs().format("YYYY-MM-DD") === date ? "TODAY" : ""}
                        </span>
                        <div className={styles.numberWrapper}>
                            { selectedDate === date && <div className={styles.calendarSelector}></div>}
                            <div
                                className={clsx(styles.number, selectedDate === date && styles.selected)}
                                onClick={() => handleDateChoice(date)}
                            >
                                {dayjs(date).format("D")}
                            </div>
                        </div>
                        {workouts[date]
                            ? <div className={styles.workoutDayMarker} style={selectedDate === date ? { transform: "translateY(8px)" } : undefined}/>
                            : <div style={{ width: 7, height: 7 }} />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}