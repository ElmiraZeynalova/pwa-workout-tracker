import {Link} from 'react-router'
export default function Footer(){
    return(
        <footer>
            <Link to="/">Home</Link>
            <Link to="/workout">Workout</Link>
            <Link to="/profile">Profile</Link>
        </footer>
    )
}