import {Link} from 'react-router'
import Footer from './Footer'
import Header from './Header'
export default function Dashboard(){
    return(
        <>
        <Header heading="Home" element={ <Link to="/calendar">Calendar</Link>}/>

        <main>

        </main>
        <Footer/>
        </>

    )
}