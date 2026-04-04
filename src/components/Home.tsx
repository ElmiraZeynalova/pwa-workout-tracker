import DateBar from './DateBar'
import MainContent from './MainContent'
import {NavLink} from 'react-router-dom'
import {useDateStore} from "../store/date-store"
import dayjs from 'dayjs'
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
export default function Home(){
    const selectedDate = useDateStore(state => state.selectedDate)
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/workouts/new">
                    <AiOutlinePlus size={24} color="black"/>
                </NavLink>
                <p className="date">{dayjs(selectedDate).format('MMMM D')}</p>
                <NavLink className="header-btn" to="/calendar">
                <MdOutlineCalendarMonth size={22} color="black"/>
                </NavLink>
            </header>
            <main>
                <DateBar />
                <MainContent/>
            </main>
        </div>

    )
}