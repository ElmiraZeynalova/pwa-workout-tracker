import styles from './FeatureCard.module.css'
import type { ReactNode } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

type Props = {
    icon: ReactNode
    title: string
    description: string
}
export default function FeatureCard({icon, title, description}: Props){
    const isDesktop = useMediaQuery('(min-width: 1024px)')
    return(
        <div className={styles.card}>
            <div className={styles.icon}>{icon}</div>
            <h3>{title}</h3>
            {isDesktop && <p>{description}</p>}
        </div>
    )
}