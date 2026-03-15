import {NavLink} from 'react-router-dom'
import {useDateStore} from "../store/date-store"
import dayjs from 'dayjs'
export default function Header(){
    const selectedDate = useDateStore(state => state.selectedDate)
    return(
        <header>
            <NavLink to="/workouts/new">
                <svg className="header-btn" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
                </svg>
            </NavLink>
            <p className="date">{dayjs(selectedDate).format('MMMM D')}</p>
            <NavLink className="header-btn" to="/calendar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 18 18" fill="currentColor">

                    <rect x="0.5" y="0.5" width="14" height="14" rx="3.2" ry="3.2" fill="none"  stroke="black" strokeWidth="1.2"/>

                    <line x1="0" y1="4.2" x2="15" y2="4.2" stroke="black" strokeWidth="1.2"/>

                    <rect x="3.8" y="-0.7" width="1.2" height="2.5" rx="0.6" fill="black"/>
                    <rect x="10.2" y="-0.7" width="1.2" height="2.5" rx="0.6" fill="black"/>

                    <circle cx="4" cy="8" r="0.8" fill="black"/>
                    <circle cx="7.5" cy="8" r="0.8" fill="black"/>
                    <circle cx="11" cy="8" r="0.8" fill="black"/>
                    <circle cx="4" cy="10.5" r="0.8" fill="black"/>
                    <circle cx="7.5" cy="10.5" r="0.8" fill="black"/>
                    <circle cx="11" cy="10.5" r="0.8" fill="black"/>
                </svg>
            </NavLink>
        </header>
    )
}