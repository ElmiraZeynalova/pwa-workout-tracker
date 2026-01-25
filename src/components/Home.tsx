import Header from './Header'
import DateBar from './DateBar'
import CarouselContent from './CarouselContent'


export default function Home(){

    return(
        <div className="layout">
            <Header/>
            <main>
                <DateBar />
                <CarouselContent />
            </main>
        </div>

    )
}