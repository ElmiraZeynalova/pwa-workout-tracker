import DayContent from './DayContent'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useRef, useEffect} from 'react'
import {useDateStore} from "../store/date-store"
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

const RANGE = 14

function generateDateRange(centerDate: Dayjs) {
  return Array.from({ length: RANGE * 2 + 1 }, (_, i) =>
    centerDate.add(i - RANGE, 'day').format('YYYY-MM-DD')
  )
}
export default function CarouselContent(){

    const selectedDate = useDateStore((state) => state.selectedDate)
    const setSelectedDate = useDateStore((state) => state.setSelectedDate)
    const centerDate = useDateStore((state) => state.centerDate)
    const setCenterDate = useDateStore((state) => state.setCenterDate)
    const swiperRef = useRef<SwiperType | null>(null)

    const dates = useMemo(
        () => generateDateRange(dayjs(centerDate)),
        [centerDate]
    )
    
    const initialSlideIndex = dates.findIndex(d => d === selectedDate)

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

        if (newDate !== selectedDate) {
            setSelectedDate(newDate)
        }

        if (index === 0 || index === dates.length - 1) {
            setCenterDate(newDate)
        }
    }
    return (
        <Swiper
            key={centerDate}
            initialSlide={initialSlideIndex}
            slidesPerView={1}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            onSlideChange={handleSlideChange}
            style={{width: '100%', flex: 1, minHeight: 0}}
        >
        {dates.map((date) => (
            <SwiperSlide key={date} style={{}}>
                <DayContent date={date} />
            </SwiperSlide>
        ))}
        </Swiper>
    )
}

