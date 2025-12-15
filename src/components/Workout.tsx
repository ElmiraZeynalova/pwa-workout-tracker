import Header from './Header'
import Footer from './Footer'
export default function Workout(){
    return(
        <div className="layout">
            <Header heading="Workout"/>
            <main>
                <h1>Hello from workouts page!!!</h1>
            </main>
            <Footer/>
        </div>

    )
}