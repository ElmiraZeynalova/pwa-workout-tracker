import DayContent from './DayContent'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState, useMemo, useRef, useEffect } from 'react'
import {useDateStore} from "../store"

export default function CarouselContent(){
    const range = 7
    const setSelectedDate = useDateStore((state) => state.setSelectedDate)
    const selectedDate = useDateStore((state) => state.selectedDate)
    const carouselRef = useRef<HTMLDivElement>(null)
    let slideWidthRef = useRef<number>(0)

    useEffect(() => {
        slideWidthRef.current = carouselRef.current!.offsetWidth
        const centerPageIndex = range
        carouselRef.current!.scrollLeft = centerPageIndex * slideWidthRef.current
    }, [])

    const today = dayjs().startOf('day')
    const [currentDate, setCurrentDate] = useState(today)


    function generateDateRange(centerDate: Dayjs){
        return Array.from({length: range * 2 + 1}, (_, i) => (
            centerDate.add(i - range, 'day').format('YYYY-MM-DD')
        ))
    }

    const dates = useMemo(
        () => generateDateRange(currentDate),
        [currentDate]
    )

    function detectPageIndex(e: any){
        const scrollLeft = e.currentTarget.scrollLeft
        const width = slideWidthRef.current
        return Math.round(scrollLeft / width)
    }

    function handleScroll(e: any){
        const index = detectPageIndex(e)
        setSelectedDate(dates[index])
    }

    return(
        <main ref={carouselRef} className="carousel-container" onScroll={handleScroll}>
            {dates.map(date => (
                <DayContent key={date} date={date}/>
            ))}

        </main>
    )
}