import DayContent from './DayContent'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react'
import {useDateStore} from "../store"


export default function CarouselContent(){
    const range = 7
    const setSelectedDate = useDateStore((state) => state.setSelectedDate)
    const selectedDate = useDateStore((state) => state.selectedDate)

    const carouselViewportRef = useRef<HTMLDivElement>(null)
    const carouselTrackRef = useRef<HTMLDivElement>(null)

    const slideWidthRef = useRef<number>(0)
    const swipeThresholdRef = useRef<number>(0)

    const today = dayjs().format('YYYY-MM-DD')
    const [centerDate, setCenterDate] = useState<string>(today)

    const startXRef = useRef<number>(0)

    const isDraggingRef = useRef<boolean>(false)

    const [activeIndex, setActiveIndex] = useState<number>(range)

    const dates = useMemo(
        () => generateDateRange(dayjs(centerDate)), 
        [centerDate]
    )

    useEffect(() => {
        slideWidthRef.current = carouselViewportRef.current!.offsetWidth
        swipeThresholdRef.current = slideWidthRef.current * 0.25
    }, [])

    useEffect(() => {
        if (!carouselTrackRef.current) return

        const index = dates.findIndex(date => date === selectedDate)

        setActiveIndex(index) 

    }, [selectedDate, dates])

    useLayoutEffect(() => {
        if (!carouselTrackRef.current) return

        carouselTrackRef.current.style.transition = 'none'
        carouselTrackRef.current.style.transform =
        `translateX(${-range * slideWidthRef.current}px)`

    }, [centerDate])

    useEffect(() => {
        console.log(dates)
        if (!carouselTrackRef.current) return

        carouselTrackRef.current.style.transition = 'transform 0.5s ease'
        carouselTrackRef.current.style.transform =
        `translateX(${-activeIndex * slideWidthRef.current}px)`

    }, [activeIndex])

    useEffect(() => {
        const track = carouselTrackRef.current
        if (!track) return

        const onTransitionEnd = () => {
            if (activeIndex === 0 || activeIndex === dates.length - 1) {
                setCenterDate(dates[activeIndex])
            }
        }

        track.addEventListener('transitionend', onTransitionEnd)
        return () => track.removeEventListener('transitionend', onTransitionEnd)
    }, [activeIndex, dates])


    function generateDateRange(centerDate: Dayjs){
        return Array.from({length: range * 2 + 1}, (_, i) => (
            centerDate.add(i - range, 'day').format('YYYY-MM-DD')
        ))
    }

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>){
        carouselTrackRef.current!.style.transition = 'none'
        e.currentTarget.setPointerCapture(e.pointerId)
        isDraggingRef.current = true
        startXRef.current = e.clientX
        
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>){

        if(!isDraggingRef.current) return

        const deltaX = e.clientX - startXRef.current

        if (carouselTrackRef.current) {
            carouselTrackRef.current.style.transform =
            `translateX(${ -activeIndex * slideWidthRef.current + deltaX }px)`
        }

    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>){
       
        if(!isDraggingRef.current) return
        e.currentTarget.releasePointerCapture(e.pointerId)
        isDraggingRef.current = false
       
        const deltaX = e.clientX - startXRef.current
        if(Math.abs(deltaX) > swipeThresholdRef.current){

            if(deltaX > 0) {//moving left
                const newIndex = activeIndex - 1
                setSelectedDate(dates[newIndex])
            }

            if(deltaX < 0){//moving right
                const newIndex = activeIndex + 1
                setSelectedDate(dates[newIndex])
            }
        }else{
            if (carouselTrackRef.current) {
                carouselTrackRef.current.style.transition = 'transform 0.5s ease'
                carouselTrackRef.current.style.transform =
                `translateX(${ -activeIndex * slideWidthRef.current}px)`
            }
        }

    }

    return(
        <div 
            className="carousel-viewport"
            ref={carouselViewportRef} 
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}>
            <div className="carousel-track" ref={carouselTrackRef}>
                {dates.map(date => (
                    <DayContent key={date} date={date}/>
                ))}
            </div>
        </div>
    )
}