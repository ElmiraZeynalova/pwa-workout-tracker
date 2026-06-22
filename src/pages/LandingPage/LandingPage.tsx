import styles from './LandingPage.module.css'
import {useNavigate} from 'react-router-dom'
import desktop_mockup from '../../assets/mockups.png'
import mobile_mockup from '../../assets/mobile-mockup.png'
import logo from '../../assets/logo.png'
import FilledButton from '../../components/buttons/FilledButton/FilledButton'
import { Icon } from '@iconify/react'
import {useState, useEffect} from 'react'
import { ROUTES } from '../../routes'
import FeatureCard from '../../components/FeatureCard/FeatureCard'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const features = [
    {
        icon: <Icon icon="uil:clipboard" color="#ff5526" className={styles.icon} />,
        title: "Workout Logging",
        description: "Log sets, reps, and weight for every exercise. Track your progress day by day with a simple calendar view."
    },
    {
        icon: <Icon icon="si:lightning-duotone" color="#ff5526"className={styles.icon} />,
        title: "Routines",
        description: "Create custom workout templates and start them with one tap. Full Body, Upper Body, Lower Body — your choice."
    },
    {
        icon: <Icon icon="ri:map-line" color="#ff5526" className={styles.icon} />,
        title: "Offline First",
        description: "No internet? No problem. Forge works fully offline and syncs your data across devices when you're back online."
    },
    {
        icon: <Icon icon="bx:bx-envelope" color="#ff5526" className={styles.icon} />,
        title: "Passwordless Login",
        description: "Sign in with just your email."
    },
    {
        icon: <Icon icon="bx:bx-shield" color="#ff5526" className={styles.icon}/>,
        title: "Cross-device Sync",
        description: "Log on mobile, review on desktop. Your workout history stays consistent across all your devices."
    },
    {
        icon: <Icon icon="feather:smartphone" color="#ff5526" className={styles.icon} />,
        title: "Install as App",
        description: "Add to your home screen on any device. Works like a native app — no App Store required."
    },

]
export default function LandingPage(){
    const navigate = useNavigate()
    const isDesktop = useMediaQuery('(min-width: 768px)')
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
            navigate(ROUTES.HOME)
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
            <img className={styles.logoImage} src={logo}/>
            <h1>Forge</h1>
        </div>

    const rightHeaderPart = <FilledButton handleClick={handleOpenAppClick} className={styles.openAppBtn}>Open App</FilledButton>

    function handleOpenAppClick(){
        navigate(ROUTES.HOME)
    }

    const featureCards = features.map(f => <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description}/>)
    return(
        <>
            {isDesktop && <header className={styles.header}>
                {leftHeaderPart}
                {middleHeaderPart}
                {rightHeaderPart}
            </header>}
            <main className={styles.mainContent}>

                {isDesktop && <section className={styles.invite}>
                    <div className={styles.info}>
                        <h1>Train. Log.</h1>
                        <h1>Repeat.</h1>
                        <p>Log your workouts. Sync across devices. No fuss.</p>
                        <FilledButton handleClick={handleInstall} className={styles.installBtn}>
                            <Icon icon="tabler:arrow-bar-to-down" color="white" width={22} height={22} />
                            Install App
                        </FilledButton>
                        <button className={styles.openInBrowser} onClick={handleOpenAppClick}>
                            Open in browser
                            <Icon icon="famicons:arrow-forward-sharp" width={18} height={18} />
                        </button>
                    </div>
                    <img src={desktop_mockup} className={styles.image}/>
                    </section>}


                    {!isDesktop && <>
                        {leftHeaderPart}
                        <img src={mobile_mockup} className={styles.image}/>
                        <div className={styles.info}>
                            <h1>Train. Log. <span>Repeat.</span></h1>
                            <p>Log your workouts. Sync across devices. No fuss.</p>
                        </div>
                    </>}
                  

                <section className={styles.features} id="features">
                    {isDesktop && <h3>FEATURES</h3>}
                    {isDesktop && <h2>Everything you need. <br/> Nothing you don't.</h2>}
                    <div className={styles.featureCards}>{featureCards}</div>
                    {!isDesktop &&
                        <div className={styles.btns}>
                            <FilledButton handleClick={handleInstall} className={styles.installBtn}>
                                <Icon icon="tabler:arrow-bar-to-down" color="white" width={22} height={22} />
                                Install App
                            </FilledButton>
                            <button className={styles.openInBrowser} onClick={handleOpenAppClick}>
                                Open in browser
                                <Icon icon="famicons:arrow-forward-sharp" width={18} height={18} />
                            </button>
                        </div>}
                </section>
            </main>
        </>
    )
}