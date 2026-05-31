import { FaChevronLeft } from "react-icons/fa";
import {NavLink} from "react-router-dom"
import CalendarMonth from './CalendarMonth'
import dayjs from "dayjs"
import {useState, useRef, useLayoutEffect} from 'react'
import { FixedSizeList as List } from 'react-window'
import type { ListChildComponentProps } from 'react-window'
import { useRenderWorkoutOnScreenStore } from "../zustand_store/render-workout-store";
import * as Dialog from '@radix-ui/react-dialog';
import { RxCross2 } from "react-icons/rx";
import dumbbellIcon from "../assets/dumbbell.svg"

const TOTAL_MONTHS = 3000
const CENTER_INDEX = Math.floor(TOTAL_MONTHS / 2)

function getMonth(index: number) {
  const date = dayjs().add(index - CENTER_INDEX, "month")

  const daysCount = date.daysInMonth()

  return {
    label: date.format("MMMM YYYY"),
    offset: (date.startOf("month").day() + 6) % 7,
    days: Array.from({ length: daysCount }, (_, d) =>
      date.date(d + 1).format("YYYY-MM-DD")
    )
  }
}

export default function CalendarPage(){
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"))
    const initialMonthIndex = CENTER_INDEX
    const [height, setHeight] = useState(0)
    const mainRef = useRef<HTMLDivElement>(null)
    const [showWorkoutSummary, setShowWorkoutSummary] = useState<boolean>(false)
    const workout = useRenderWorkoutOnScreenStore(state => state.workouts[selectedDate])
   
    useLayoutEffect(() => {
        if (!mainRef.current) return

        const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            setHeight(entry.contentRect.height)
        }
        })

        resizeObserver.observe(mainRef.current)

        return () => resizeObserver.disconnect()
    }, [])

    const Row = ({ index, style }: ListChildComponentProps) => {
        const month = getMonth(index)
        return (
            <div style={style}>
            <div
                style={{
                height: 390,
                borderBottom: "0.2px solid #b7b7b7a0",
                boxSizing: "border-box"
                }}
            >
                <CalendarMonth
                    monthName={month.label}
                    dates={month.days}
                    offset={month.offset}
                    selectedDate={selectedDate}
                    onSelectedDate={setSelectedDate}
                    toggleShowWorkoutSummary={setShowWorkoutSummary}
                />
            </div>
            </div>
        )
    }
    
    const exercisesPerformed = workout?.exercises.map(e => {
        const setCount = e.sets.length
        return <div className="exercise">
            <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
            <p>{setCount} {setCount > 1 ? "sets" : "set"} {e.exerciseName}</p>
        </div>
    })

    return(
        <>
        {(showWorkoutSummary && workout) && 
            <Dialog.Root open={showWorkoutSummary} onOpenChange={setShowWorkoutSummary}>
            <Dialog.Portal>
                <Dialog.Overlay className="overlay" /> 
                <Dialog.Title></Dialog.Title>
                <Dialog.Content aria-describedby={undefined} className="calendar-workout-summary">
                        <div className="summary-top">
                            <p>{dayjs(selectedDate).format("dddd, MMMM DD YYYY")}</p>
                            <RxCross2 size={20} className="cross-btn" color="#858585" onClick={() => setShowWorkoutSummary(false)}/>
                        </div>
                        <main>{exercisesPerformed}</main>
                        <NavLink to="/" className="go-to-btn">
                            Go to
                        </NavLink>
                </Dialog.Content>
            </Dialog.Portal>
            </Dialog.Root>
            }
        <div className="layout" style={{ height: "100vh", overflow: "hidden" }}>
            <header>
                <NavLink className="header-btn" to="/">
                    <FaChevronLeft size={16} color="black" />
                </NavLink>
                <p>Calendar</p>
                <div style={{width: '16px'}}></div>
            </header>
            <div className="calendar-page-day-bar">
                {["M", "T", "W", "T", "F", "S", "S" ].map((d, idx) => <div key={idx}>{d}</div>)}
            </div>
            <main ref={mainRef} style={{ flex: 1 }}>
                {height > 0 && (
                        <List
                            height={height}
                            itemCount={TOTAL_MONTHS}
                            itemSize={390}
                            initialScrollOffset={initialMonthIndex * 390}
                            width="100%"
                        >
                            {Row}
                        </List>
                    )}
            </main>
        </div>
        </>
    )
}

