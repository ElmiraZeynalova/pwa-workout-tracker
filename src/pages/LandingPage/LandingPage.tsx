import styles from './LandingPage.module.css'
import {useNavigate} from 'react-router-dom'
import mockups from '../../assets/mockups.png'
import logo from '../../assets/logo.png'
import FilledButton from '../../components/buttons/FilledButton/FilledButton'
import { Icon } from '@iconify/react'
import {useState, useEffect} from 'react'
import { ROUTES } from '../../routes'
export default function LandingPage(){
    const navigate = useNavigate()

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
        })
    }, [])

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt()
            await deferredPrompt.userChoice
            setDeferredPrompt(null)
        } else {
            navigate(ROUTES.LOGIN)
        }
    }

    const middleHeaderPart = 
        <div className={styles.links}>
            <a href="#features">Features</a>
            <a 
                href="https://github.com/ElmiraZeynalova/pwa-workout-tracker" 
                target="_blank" 
                rel="noopener noreferrer"
                >
                GitHub
            </a>
        </div>

    const leftHeaderPart = 
        <div className={styles.logo}>
            <img src={logo} width={50} height={50}/>
            <h1>Forge</h1>
        </div>

    const rightHeaderPart = <FilledButton handleClick={handleOpenAppClick} className={styles.openAppBtn}>Open App</FilledButton>

    function handleOpenAppClick(){
        navigate(ROUTES.LOGIN)
    }

    return(
        <>
            <header className={styles.header}>
                {leftHeaderPart}
                {middleHeaderPart}
                {rightHeaderPart}
            </header>
            <main className={styles.mainContent}>

                <section className={styles.invite}>
                    <div className={styles.info}>
                        <h1>Train. Log.</h1>
                        <h1>Repeat.</h1>
                        <p>Log your workouts. Sync across devices. No fuss.</p>
                        <FilledButton handleClick={handleInstall} className={styles.installBtn}>
                            <Icon icon="line-md:arrow-align-bottom" width={18} height={18} />
                            Install App
                        </FilledButton>
                        <button className={styles.openInBrowser} onClick={handleOpenAppClick}>
                            Open in browser
                            <Icon icon="famicons:arrow-forward-sharp" width={18} height={18} />
                        </button>
                    </div>
                    <img src={mockups} width={700} height={600}/>

                </section>

                <section className={styles.features} id="features"></section>
            </main>
        </>
    )
}