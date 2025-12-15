import {NavLink} from 'react-router'
export default function Footer(){
    return(
        <footer>
            <NavLink className={({isActive}) =>  isActive ? "navigation-btn active" : "navigation-btn"} to="/">
                <img className="icon" src='src/assets/icons/home1.svg'/>
                Home
            </NavLink>
            <NavLink className="navigation-btn" to="/workout">
                <img className="icon" src="src/assets/icons/dumbbell6.svg"/>
                Workout
            </NavLink>
            <NavLink className="navigation-btn" to="/profile">
                <img className="icon" src="src/assets/icons/profile10.svg"/>
                Profile
            </NavLink>
        </footer>
    )
}