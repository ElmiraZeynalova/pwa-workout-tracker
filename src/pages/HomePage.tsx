import WeekSwiper from '../components/WeekSwiper'
import DaySwiper from '../components/DaySwiper'
import {NavLink} from 'react-router-dom'
import {useDateStore} from "../store/date-store"
import dayjs from 'dayjs'
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Header from '../components/Header'
import styles from './HomePage.module.css'
export default function HomePage(){
    const selectedDate = useDateStore(state => state.selectedDate)
    return(
        <div className="layout">
            <Header 
                title={<p className={styles.title}>{dayjs(selectedDate).format('MMMM D')}</p>}
                leftButton={<NavLink className={styles.headerBtn} to="/workouts/new"><AiOutlinePlus size={26} color="black"/></NavLink>}
                rightButton={<NavLink className={styles.headerBtn} to="/calendar"><MdOutlineCalendarMonth size={24} color="black"/></NavLink>}
            />
            <WeekSwiper />
            <main>
                <DaySwiper/>
            </main>
        </div>

    )
}