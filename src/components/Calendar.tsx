
import {NavLink} from "react-router-dom"
export default function Calendar(){
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </NavLink>
                <p>Calendar</p>
                <div style={{width: '25px'}}></div>
            </header>
            <main>
                <h1>Calendar page</h1>
            </main>

        </div>
    )
}
