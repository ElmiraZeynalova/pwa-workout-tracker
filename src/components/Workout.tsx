import Header from './Header'
import Footer from './Footer'
import { NavLink } from 'react-router'
export default function Workout(){

    function handleStartWorkoutBtnClick(){
        console.log("Starting new workout...")
    }
    
    return(
        <div className="layout">
            <Header heading="Workout"/>
            <main>
                <NavLink to="/logWorkout" className="start-workout-btn" onClick={handleStartWorkoutBtnClick}>
                    <svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="21" height="21" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"></path>
                    </svg>
                    Start New Workout
                </NavLink>
                <h1>Hello from workouts page!!!</h1>

            </main>
            <Footer/>
        </div>

    )
}

