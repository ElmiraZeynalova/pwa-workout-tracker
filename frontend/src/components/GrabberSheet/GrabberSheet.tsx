import LogWorkoutPage from '../../pages/LogWorkoutPage/LogWorkoutPage'
import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'
import { Icon } from '@iconify/react'
import styles from './GrabberSheet.module.css'

export default function GrabberSheet({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
    const sheetRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement | null>(null)
    const goingDown = useRef<boolean>(false)

    const [position, setPosition] = useState<number>(0)
    const startY = useRef<number>(0)
    const buttonWidth = useRef<number>(50)
    const thresholdForPointerMove = useRef<number>(0)
    const thresholdForPointerUp = useRef<number>(0)
    const navigate = useNavigate()

    useEffect(() => {
        if (goingDown.current) return
        if (!sheetRef.current) return
        sheetRef.current.style.transform = `translateY(-${position}px)`;
        if (!buttonRef.current) return
        buttonWidth.current = buttonWidth.current + 1
        buttonRef.current.style.width = `${buttonWidth.current}%`
    }, [position])

    function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        goingDown.current = false
        startY.current = e.clientY
        thresholdForPointerMove.current = containerRef.current!.scrollHeight * 0.25
        thresholdForPointerUp.current = containerRef.current!.scrollHeight * 0.7
    }

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const newPosition = startY.current - e.clientY
        if (e.clientY >= thresholdForPointerMove.current) {
            setPosition(newPosition)
        } else {
            navigate(ROUTES.WORKOUTS_NEW)
        }
    }

    function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        if (e.clientY > thresholdForPointerUp.current) {
            goingDown.current = true
            if (!sheetRef.current) return
            sheetRef.current.style.transition = 'transform 300ms ease-out';
            sheetRef.current.style.transform = `translateY(${0}px)`;
            if (!buttonRef.current) return
            buttonWidth.current = 50
            buttonRef.current.style.width = `${buttonWidth.current}%`
        } else {
            navigate(ROUTES.WORKOUTS_NEW)
        }

    }

    return (
        <div className={styles.sheet} ref={sheetRef}>
            <div ref={buttonRef} className={styles.startWorkoutBtn} onPointerDown={(e) => handlePointerDown(e)} onPointerMove={(e) => handlePointerMove(e)} onPointerUp={(e) => handlePointerUp(e)}>
                <Icon icon="boxicons:plus" color="#ff5526" width={28} height={28} />
                Start New Workout
            </div>
            <LogWorkoutPage />
        </div>
    )
}