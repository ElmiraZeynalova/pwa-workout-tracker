import DayContent from './DayContent'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState, useMemo, useRef, useEffect} from 'react'
import {useDateStore} from "../store"
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

const RANGE = 7

function generateDateRange(centerDate: Dayjs) {
  return Array.from({ length: RANGE * 2 + 1 }, (_, i) =>
    centerDate.add(i - RANGE, 'day').format('YYYY-MM-DD')
  )
}
export default function CarouselContent(){

    const setSelectedDate = useDateStore((state) => state.setSelectedDate)
    const today = dayjs().format('YYYY-MM-DD')
    const [centerDate, setCenterDate] = useState<string>(today)
    const swiperRef = useRef<SwiperType | null>(null)

    const dates = useMemo(
        () => generateDateRange(dayjs(centerDate)),
        [centerDate]
    )
const selectedDate = useDateStore((state) => state.selectedDate)

    useEffect(() => {
        if (!swiperRef.current) return

        const index = dates.findIndex(d => d === selectedDate)

        if (index === -1) return

        if (swiperRef.current.activeIndex === index) return

        swiperRef.current.slideTo(index)
    }, [selectedDate, dates])

    const handleSlideChange = (swiper: SwiperType) => {
        const index = swiper.activeIndex
        const newDate = dates[index]
        setSelectedDate(newDate)

        if (index === 0 || index === dates.length - 1) {
            setCenterDate(newDate)
        }
    }

    return (
        <Swiper
            key={centerDate}
            initialSlide={RANGE}
            slidesPerView={1}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            onSlideChange={handleSlideChange}
            style={{ width: '100%', height: '100vh' }}
        >
        {dates.map((date) => (
            <SwiperSlide key={date}>
                <DayContent date={date} />
            </SwiperSlide>
        ))}
        </Swiper>
    )
}

