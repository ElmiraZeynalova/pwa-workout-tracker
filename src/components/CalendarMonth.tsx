import {useRenderWorkoutOnScreenStore} from '../zustand_store/render-workout-store'
import dayjs from "dayjs"
import clsx from 'clsx'

interface Props {
  monthName: string
  dates: string[]
  offset: number
  selectedDate: string
  onSelectedDate: (date: string) => void
  innerRef?: React.RefObject<HTMLDivElement | null>
}

export default function CalendarMonth({ monthName, dates, offset, selectedDate, onSelectedDate, innerRef }: Props){
    const workouts = useRenderWorkoutOnScreenStore((state) => state.workouts)
    
    return(
        <div className="month" ref={innerRef}>
            <h1>{monthName}</h1>
            <div className="dates">
                {Array.from({ length: offset }, (_, i) => (
                    <div key={`empty-${i}`} className="date" />
                ))}
                {dates.map(date => (
                    <div key={date} className="date">
                        <span className="today-label">
                            {dayjs().format("YYYY-MM-DD") === date ? "TODAY" : ""}
                        </span>
                        <div
                            className={clsx("number", selectedDate === date && "selected")}
                            onClick={() => onSelectedDate(date)}
                        >
                            {dayjs(date).format("D")}
                        </div>
                        {workouts[date]
                            ? <div className="workout-day-marker" />
                            : <div style={{ width: 5, height: 5 }} />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}