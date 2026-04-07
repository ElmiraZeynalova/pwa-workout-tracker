import WeekSwiper from './WeekSwiper'
import DaySwiper from './DaySwiper'
import {NavLink} from 'react-router-dom'
import {useDateStore} from "../zustand_store/date-store"
import dayjs from 'dayjs'
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
export default function HomePage(){
    const selectedDate = useDateStore(state => state.selectedDate)
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/workouts/new">
                    <AiOutlinePlus size={26} color="black"/>
                </NavLink>
                <p className="date">{dayjs(selectedDate).format('MMMM D')}</p>
                <NavLink className="header-btn" to="/calendar">
                    <MdOutlineCalendarMonth size={24} color="black"/>
                </NavLink>
            </header>
            <WeekSwiper />
            <main>
                <DaySwiper/>
            </main>
        </div>

    )
}