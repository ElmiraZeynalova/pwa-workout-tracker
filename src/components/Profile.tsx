import Header from './Header'
import Footer from './Footer'
export default function Profile(){
    return(
        <div className="layout">
            <Header heading="Profile"/>
            <main>
                <h1>Hello from Profile page!!!</h1>
            </main>
            <Footer/>
        </div>
       
    )
}