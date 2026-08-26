import styles from './Calendar.module.css'
import { useDateStore } from '../../../store/date-store'
import dayjs from 'dayjs'
import CalendarMonth from '../../CalendarMonth/CalendarMonth'
import Button from '../../Button/Button';
import { Icon } from '@iconify/react'

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
                        <Button handleClick={() => setSelectedDate(date.subtract(1, 'month').format('YYYY-MM-DD'))} fill={false}><Icon icon="boxicons:chevron-left" width={30} height={30} color="#ff5526" /></Button>
                        <Button handleClick={() => setSelectedDate(date.add(1, 'month').format('YYYY-MM-DD'))} fill={false}><Icon icon="boxicons:chevron-right" width={30} height={30} color="#ff5526" /></Button>
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
