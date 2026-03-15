
import {NavLink} from "react-router-dom"
export default function Calendar(){
    return(
        <div className="layout">
            <header className="calendar-header">
                <NavLink className="go-home-btn" to="/">
                    <svg className="header-btn" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </NavLink>
                <p>Calendar</p>
            </header>
            <main>
                <h1>Calendar page</h1>
            </main>

        </div>
    )
}