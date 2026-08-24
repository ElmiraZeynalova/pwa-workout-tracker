import { FaChevronLeft } from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom"
import CalendarMonth from '../../components/CalendarMonth/CalendarMonth'
import dayjs from "dayjs"
import {useState, useRef, useLayoutEffect} from 'react'
import { FixedSizeList as List } from 'react-window'
import type { ListChildComponentProps } from 'react-window'
import { useRenderDataOnScreenStore } from "../../store/render-data-store";
import { RxCross2 } from "react-icons/rx";
import dumbbellIcon from "../../assets/dumbbell.svg"
import { useDateStore } from "../../store/date-store";
import Header from "../../components/Header/Header"
import styles from "./CalendarPage.module.css"
import Button from "../../components/Button/Button";
import { ROUTES } from "../../utils/constants";
import Modal from "../../components/Modal/Modal";
const TOTAL_MONTHS = 3000
const CENTER_INDEX = Math.floor(TOTAL_MONTHS / 2)
import { useMutation } from '@tanstack/react-query'
import { logout } from "../../api/auth";
import {useAuthState} from '../../context/AuthContext'

function getMonth(index: number) {
  const date = dayjs().add(index - CENTER_INDEX, "month")
  const daysCount = date.daysInMonth()

  return {
    label: date.format("MMMM YYYY"),
    offset: (date.startOf("month").day() + 6) % 7,
    days: Array.from({ length: daysCount }, (_, d) =>
      date.date(d + 1).format("YYYY-MM-DD")
    )
  }
}

export default function CalendarPage(){
    const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(dayjs().format("YYYY-MM-DD"))
    const initialMonthIndex = CENTER_INDEX
    const [height, setHeight] = useState(0)
    const mainRef = useRef<HTMLDivElement>(null)
    const [showModal, setShowModal] = useState<boolean>(false)
    const workout = useRenderDataOnScreenStore(state => state.workouts[selectedCalendarDate])
   
    const setCenterDate = useDateStore(state => state.setCenterDate)
    const setSelectedDate = useDateStore(state => state.setSelectedDate)

    const navigate = useNavigate()

    const {markAsUnauthenticated} = useAuthState()
    
    const logoutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: () => {
            markAsUnauthenticated()
            navigate(ROUTES.LOGIN)
        },
    })

    useLayoutEffect(() => {
        if (!mainRef.current) return

        const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            setHeight(entry.contentRect.height)
        }
        })

        resizeObserver.observe(mainRef.current)

        return () => resizeObserver.disconnect()
    }, [])

    const Row = ({ index, style }: ListChildComponentProps) => {
        const month = getMonth(index)
        return (
            <div style={style}>
            <div
                style={{
                height: 390,
                borderBottom: "0.2px solid #b7b7b7a0",
                boxSizing: "border-box"
                }}
            >
                <CalendarMonth
                    monthName={month.label}
                    dates={month.days}
                    offset={month.offset}
                    selectedDate={selectedCalendarDate}
                    onSelectedDate={setSelectedCalendarDate}
                    toggleShowWorkoutSummary={setShowModal}
                />
            </div>
            </div>
        )
    }
    
    const exercisesPerformed = workout?.exercises.map(e => {
        const setCount = e.sets.length
        return <div key={e.exerciseId} className={styles.exercise}>
            <img src={dumbbellIcon} alt="exercise icon" width={40} height={40}/>
            <p>{setCount} {setCount > 1 ? "sets" : "set"} {e.name}</p>
        </div>
    })

    function handleClick(){
       setCenterDate(selectedCalendarDate)
       setSelectedDate(selectedCalendarDate)
       navigate(ROUTES.HOME)
    }

    return(
        <>

        <Modal open={workout && showModal} closeModal={() => setShowModal(false)}>
            <Modal.Overlay/>
            <Modal.Container>
                <Modal.Header className={styles.modalHeader}>
                    <>
                        <p>{dayjs(selectedCalendarDate).format("dddd, MMMM DD YYYY")}</p>
                        <RxCross2 size={20} className={styles.crossBtn} color="#858585" onClick={() => setShowModal(false)}/>
                    </>
                </Modal.Header>
                <Modal.Content className={styles.modalContent}>
                    <>
                        <div className={styles.exercisesPerformed}>{exercisesPerformed}</div>
                        <Button handleClick={handleClick} className={styles.goToBtn} fill={true}>Go to</Button>
                    </>
                </Modal.Content>
            </Modal.Container>
        </Modal>    

        <div className="mobile-layout" style={{ height: "100vh", overflow: "hidden" }}>
            <Header>
                <Header.LeftButton><Link className={styles.headerBtn} to={ROUTES.HOME}><FaChevronLeft size={16} color="black" /></Link></Header.LeftButton>
                <Header.Title>Calendar</Header.Title>
                <Header.RightButton><button onClick={() => logoutMutation.mutate()}>Logout</button></Header.RightButton>
            </Header>
            <div className={styles.calendarDateBar}>
                {["M", "T", "W", "T", "F", "S", "S" ].map((d, idx) => <div key={idx}>{d}</div>)}
            </div>
            <main ref={mainRef} style={{ flex: 1 }}>
                {height > 0 && (
                        <List
                            height={height}
                            itemCount={TOTAL_MONTHS}
                            itemSize={390}
                            initialScrollOffset={initialMonthIndex * 390}
                            width="100%"
                        >
                            {Row}
                        </List>
                    )}
            </main>
        </div>
        </>
    )
}

