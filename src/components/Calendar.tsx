import Header from './Header'
import {NavLink} from "react-router"
export default function Calendar(){
    return(
        <div className="layout">
            <Header/>
            <main>
                <h1>Hello from Calendar page!!!</h1>
                <NavLink to="/">Go Home</NavLink>
            </main>

        </div>
    )
}