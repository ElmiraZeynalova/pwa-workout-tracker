import styles from './Calendar.module.css'
import { useDateStore } from '../../../store/date-store'
import dayjs from 'dayjs'
import CalendarMonth from '../../CalendarMonth/CalendarMonth'
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import EmptyButton from '../../buttons/EmptyButton/EmptyButton';
export default function Calendar(){
    const selectedDate = useDateStore(state => state.selectedDate)
    const setSelectedDate = useDateStore(state => state.setSelectedDate)
    const date = dayjs(selectedDate)

    const month = {
        label: date.format("MMMM YYYY"),
        offset: (date.startOf("month").day() + 6) % 7,
        days: Array.from(
            { length: date.daysInMonth() },
            (_, d) => date.date(d + 1).format("YYYY-MM-DD")
        )
    }

    return(
        <>
            <div className={styles.calendarLayout}>
                <div className={styles.top}>
                    <h1>{dayjs(selectedDate).format("MMMM YYYY")}</h1>
                    <div className={styles.buttons}>
                        <EmptyButton handleClick={() => setSelectedDate(date.subtract(1, 'month').format('YYYY-MM-DD'))}><FaChevronLeft size={16} color="#ff5526" /></EmptyButton>
                        <EmptyButton handleClick={() => setSelectedDate(date.add(1, 'month').format('YYYY-MM-DD'))}><FaChevronRight size={16} color="#ff5526" /></EmptyButton>
                    </div>
                </div>

                <div className={styles.calendarDateBar}>
                    {["M", "T", "W", "T", "F", "S", "S" ].map((d, idx) => <div key={idx}>{d}</div>)}
                </div>

                <CalendarMonth
                    device="desktop"
                    monthName={month.label}
                    dates={month.days}
                    offset={month.offset}
                    selectedDate={selectedDate}
                    onSelectedDate={setSelectedDate}
                />
            </div>
        </>
    )
}
