import {NavLink} from 'react-router'
export default function Footer(){
    return(
        <footer>
            <NavLink className={({isActive}) =>  isActive ? "navigation-btn active" : "navigation-btn"} to="/">
                <img className="icon" src='/icons/home.svg' alt="Home"/>
                Home
            </NavLink>
            <NavLink className="navigation-btn" to="/workout">
                <img className="icon" src="/icons/dumbbell.svg" alt="Dumbbell"/>
                Workout
            </NavLink>
            <NavLink className="navigation-btn" to="/profile">
                <img className="icon" src="/icons/profile.svg" alt="Profile"/>
                Profile
            </NavLink>
        </footer>
    )
}