import styles from './Calendar.module.css'
import { useDateStore } from '../../../store/date-store'
import dayjs from 'dayjs'
import CalendarMonth from '../../CalendarMonth/CalendarMonth'
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Button from '../../Button/Button';
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
                        <Button handleClick={() => setSelectedDate(date.subtract(1, 'month').format('YYYY-MM-DD'))} fill={false}><FaChevronLeft size={16} color="#ff5526" /></Button>
                        <Button handleClick={() => setSelectedDate(date.add(1, 'month').format('YYYY-MM-DD'))} fill={false}><FaChevronRight size={16} color="#ff5526" /></Button>
                    </div>
                </div>

                <div className={styles.calendarDateBar}>
                    {["M", "T", "W", "T", "F", "S", "S" ].map((d, idx) => <div key={idx}>{d}</div>)}
                </div>

                <CalendarMonth
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
