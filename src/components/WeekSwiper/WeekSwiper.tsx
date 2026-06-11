import { useDateStore } from '../../store/date-store'
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react"
import clsx from 'clsx'
import styles from './WeekSwiper.module.css'
dayjs.extend(isoWeek)

function generateWeeks(centerWeek: dayjs.Dayjs) {
  return [
    centerWeek.subtract(1, "week"),
    centerWeek,
    centerWeek.add(1, "week"),
  ]
}

export default function WeekSwiper() {
  const selectedDate = useDateStore((state) => state.selectedDate)
  const setSelectedDate = useDateStore((state) => state.setSelectedDate)

  const dateBarRef = useRef<HTMLDivElement>(null)

  const [centerWeek, setCenterWeek] = useState(
    () => dayjs(selectedDate).startOf("isoWeek")
  )
  const swiperRef = useRef<SwiperType | null>(null)

  const weeks = useMemo(() => generateWeeks(centerWeek), [centerWeek])

    useLayoutEffect(() => {
    const el = document.querySelector(`.swiper-slide-active [data-date="${selectedDate}"]`)
    const parent = dateBarRef.current
    if (el && parent) {
        const rect = el.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()
        const x = rect.left - parentRect.left + rect.width / 2 - 22
        document.documentElement.style.setProperty('--move-x', `${x}px`)
    }
    }, [selectedDate, centerWeek])

  useEffect(() => {
    if (!swiperRef.current) return

    const weekStart = dayjs(selectedDate).startOf("isoWeek")
    const index = weeks.findIndex((w) => w.isSame(weekStart, "day"))

    if (index === -1) {
      setCenterWeek(weekStart)
      return
    }

    if (swiperRef.current.activeIndex !== index) {
      swiperRef.current.slideTo(index)
    }
  }, [selectedDate, weeks])

  function generateWeek(date: dayjs.Dayjs) {
    return Array.from({ length: 7 }, (_, i) => date.startOf("isoWeek").add(i, "day"))
  }

  function handleSlideChange(swiper: SwiperType) {
    const index = swiper.activeIndex
    const weekday = dayjs(selectedDate).isoWeekday() - 1

    const newDate = weeks[index].add(weekday, "day")
    setSelectedDate(newDate.format("YYYY-MM-DD"))

    if (index === 0 || index === weeks.length - 1) {
      setCenterWeek(weeks[index])
    }
  }

  return (
    <div className={styles.dateBar} ref={dateBarRef}>
        <div className={styles.selector}></div>
        <Swiper
          className={styles.swiper}
          key={centerWeek.format("YYYY-MM-DD")} 
          initialSlide={1}
          slidesPerView={1}
          spaceBetween={40}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          style={{ display: "flex", width: "100%", height: "70px" }}>
        {weeks.map((date) => (
            <SwiperSlide
            className={styles.swiperSlide}
            key={date.format("YYYY-MM-DD")}
            style={{ display: "flex", width: "100%", alignItems: "center", justifyContent:'space-around' }}
            >
            {generateWeek(date).map((day, idx) => (
              
                <div key={idx} className={styles.day}>
                <div className={clsx(styles.dayOfWeek, dayjs().format("YYYY-MM-DD") === day.format("YYYY-MM-DD") && styles.today)}>
                  {dayjs().format("YYYY-MM-DD") === day.format("YYYY-MM-DD") ? "TODAY" : day.format("dd")[0]}</div>
                <div
                    data-date={day.format("YYYY-MM-DD")}
                    onClick={(e) => {
                        setSelectedDate(day.format("YYYY-MM-DD"))
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = rect.left + rect.width / 2 - 20
                        document.documentElement.style.setProperty('--move-x', `${x}px`)
                    }}
                    className={clsx(styles.number, day.format("YYYY-MM-DD") === selectedDate && styles.selected)}
                >
                    {day.format("D")}
                </div>
                </div>
            ))}
            </SwiperSlide>
        ))}
        </Swiper>
    </div>
  )
}