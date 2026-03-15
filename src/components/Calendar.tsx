
import {NavLink} from "react-router-dom"
export default function Calendar(){
    return(
        <div className="layout">
            <header>
                <NavLink className="header-btn" to="/">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </NavLink>
                <p>Calendar</p>
                <div style={{width: '28px'}}></div>
            </header>
            <main>
                <h1>Calendar page</h1>
            </main>

        </div>
    )
}
