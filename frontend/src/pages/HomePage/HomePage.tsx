import WeekSwiper from '../../components/WeekSwiper/WeekSwiper'
import DaySwiper from '../../components/DaySwiper/DaySwiper'
import {Link} from 'react-router-dom'
import {useDateStore} from "../../store/date-store"
import dayjs from 'dayjs'
import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineCalendarMonth } from "react-icons/md";
import Header from '../../components/Header/Header'
import styles from './HomePage.module.css'
import { ROUTES } from '../../utils/constants'
export default function HomePage(){
    const selectedDate = useDateStore(state => state.selectedDate)

    return(
        <div className="mobile-layout">

            <Header>
                <Header.LeftButton><Link className={styles.headerBtn} to={ROUTES.WORKOUTS_NEW}><AiOutlinePlus size={26} color="black"/></Link></Header.LeftButton>
                <Header.Title>{dayjs(selectedDate).format('MMMM D')}</Header.Title>
                <Header.RightButton><Link className={styles.headerBtn} to={ROUTES.CALENDAR}><MdOutlineCalendarMonth size={24} color="black"/></Link></Header.RightButton>
            </Header>
            <WeekSwiper />
            <main>
                <DaySwiper/>
            </main>
        </div>

    )
}