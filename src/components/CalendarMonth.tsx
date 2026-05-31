import {useRenderWorkoutOnScreenStore} from '../zustand_store/render-workout-store'
import dayjs from "dayjs"
import clsx from 'clsx'

interface Props {
  monthName: string
  dates: string[]
  offset: number
  selectedDate: string
  onSelectedDate: (date: string) => void
  toggleShowWorkoutSummary: (status: boolean) => void
}

export default function CalendarMonth({ monthName, dates, offset, selectedDate, onSelectedDate, toggleShowWorkoutSummary}: Props){
    const workouts = useRenderWorkoutOnScreenStore((state) => state.workouts)
    
    function handleDateChoice(date: string){
        onSelectedDate(date)
        toggleShowWorkoutSummary(true)

    }

    return(
        <div className="calendar-month">
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
                        <div className="number-wrapper">
                            { selectedDate === date && <div className="calendar-selector"></div>}
                            <div
                                className={clsx("number", selectedDate === date && "selected")}
                                onClick={() => handleDateChoice(date)}
                            >
                                {dayjs(date).format("D")}
                            </div>
                        </div>
                        {workouts[date]
                            ? <div className="workout-day-marker" style={selectedDate === date ? { transform: "translateY(8px)" } : undefined}/>
                            : <div style={{ width: 7, height: 7 }} />
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}