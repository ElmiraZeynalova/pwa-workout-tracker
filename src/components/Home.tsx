import {Link} from 'react-router'
import Footer from './Footer'
import Header from './Header'
export default function Dashboard(){
    return(
        <div className="layout">
            <Header heading="Home" 
                    element={ <Link to="/calendar">
                                <img className="icon" src="/icons/calendar.svg" alt="Calendar"/>
                            </Link>}/>
            <main>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit officiis minima ad rem placeat, ducimus obcaecati pariatur, fugit animi doloribus repudiandae quisquam rerum. Beatae voluptas ad enim commodi aperiam laboriosam.</p>
            </main>
            <Footer/>
        </div>

    )
}