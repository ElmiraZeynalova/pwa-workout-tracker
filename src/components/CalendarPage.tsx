import { FaChevronLeft } from "react-icons/fa";
import {NavLink} from "react-router-dom"
import CalendarMonth from './CalendarMonth'
import dayjs from "dayjs"
import {useState, useRef, useEffect} from 'react'

const months = Array.from({ length: 12 }, (_, i) => {
  const month = dayjs().startOf("year").month(i);
  const daysCount = month.daysInMonth();
  
    return {
        label: month.format("MMMM"),
        offset: (month.startOf("month").day() + 6) % 7,
        days: Array.from({ length: daysCount }, (_, d) =>
            month.date(d + 1).format("YYYY-MM-DD")
        ),
    }
})


export default function CalendarPage(){
    const currentMonthRef = useRef<HTMLDivElement>(null)
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format("YYYY-MM-DD"))
    const monthsComponents = months.map((month, i) => <CalendarMonth key={month.label} innerRef={i === dayjs().month() ? currentMonthRef : undefined} monthName={month.label} dates={month.days} offset={month.offset} selectedDate={selectedDate} onSelectedDate={setSelectedDate}/>)
    
    useEffect(() => {
        currentMonthRef.current?.scrollIntoView({ block: "start"})
    }, [])

    return(
        <div className="layout" style={{ overflowY: 'auto'}}>
            <header>
                <NavLink className="header-btn" to="/">
                    <FaChevronLeft size={16} color="black" />
                </NavLink>
                <p>Calendar</p>
                <div style={{width: '16px'}}></div>
            </header>
            <div className="calendar-page-day-bar">
                {["M", "T", "W", "T", "F", "S", "S" ].map(d => <div>{d}</div>)}
            </div>
            <main style={{height: 0}}>
                <div className="calendar-page-content">{monthsComponents}</div>
            </main>
        </div>
    )
}
