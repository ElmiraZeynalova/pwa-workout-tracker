import { useDateStore } from "../store/date-store"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import { useState, useRef, useEffect, useMemo } from "react"

dayjs.extend(isoWeek)

function generateWeeks(centerWeek: dayjs.Dayjs) {
  return [
    centerWeek.subtract(1, "week"),
    centerWeek,
    centerWeek.add(1, "week"),
  ]
}

export default function DateBar() {
  const selectedDate = useDateStore((state) => state.selectedDate)
  const setSelectedDate = useDateStore((state) => state.setSelectedDate)

  const [centerWeek, setCenterWeek] = useState(
    () => dayjs(selectedDate).startOf("isoWeek")
  )
  const swiperRef = useRef<SwiperType | null>(null)

  const weeks = useMemo(() => generateWeeks(centerWeek), [centerWeek])

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
    <Swiper
      key={centerWeek.format("YYYY-MM-DD")} 
      initialSlide={1}
      slidesPerView={1}
      spaceBetween={50}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      onSlideChange={handleSlideChange}
      style={{ display: "flex", width: "100%" }}
    >
      {weeks.map((date) => (
        <SwiperSlide
          key={date.format("YYYY-MM-DD")}
          style={{ display: "flex", width: "100%", justifyContent: "space-around" }}
        >
          {generateWeek(date).map((day, idx) => (
            <div key={idx} className="day">
              <div className="dayOfWeek">{day.format("dd")[0]}</div>
              <div
                onClick={() => setSelectedDate(day.format("YYYY-MM-DD"))}
                className="number"
              >
                {day.format("D")}
              </div>
            </div>
          ))}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}