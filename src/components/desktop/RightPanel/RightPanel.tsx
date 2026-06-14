import styles from './RightPanel.module.css'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

export default function RightPanel({children}: Props){
    return(
        <div className={styles.rightPanelLayout}>
            {children}
        </div> 
    )
}