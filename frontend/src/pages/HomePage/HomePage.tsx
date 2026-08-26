import WeekSwiper from '../../components/WeekSwiper/WeekSwiper'
import DaySwiper from '../../components/DaySwiper/DaySwiper'
import {Link} from 'react-router-dom'
import {useDateStore} from "../../store/date-store"
import dayjs from 'dayjs'
import { Icon } from '@iconify/react'
import Header from '../../components/Header/Header'
import styles from './HomePage.module.css'
import { ROUTES } from '../../utils/constants'
export default function HomePage(){
    const selectedDate = useDateStore(state => state.selectedDate)

    return(
        <div className="mobile-layout">

            <Header>
                <Header.LeftButton><Link className={styles.headerBtn} to={ROUTES.WORKOUTS_NEW}><Icon icon="boxicons:plus" width={26} height={26} color="black"/></Link></Header.LeftButton>
                <Header.Title>{dayjs(selectedDate).format('MMMM D')}</Header.Title>
                <Header.RightButton><Link className={styles.headerBtn} to={ROUTES.CALENDAR}><Icon icon="uil:calendar-alt" color="black" width={24} height={24} /></Link></Header.RightButton>
            </Header>
            <WeekSwiper />
            <main>
                <DaySwiper/>
            </main>
        </div>

    )
}