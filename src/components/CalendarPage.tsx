import { FaChevronLeft } from "react-icons/fa";
import {NavLink} from "react-router-dom"
export default function CalendarPage(){
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/">
                    <FaChevronLeft size={16}/>
                </NavLink>
                <p>Calendar</p>
                <div style={{width: '16px'}}></div>
            </header>
            <main>
                <h1>Calendar page</h1>
            </main>

        </div>
    )
}
