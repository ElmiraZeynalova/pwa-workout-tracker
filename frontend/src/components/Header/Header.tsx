import type { ReactNode } from 'react'
import styles from './Header.module.css'


export default function Header({children}: {children: ReactNode}){
    return(
        <header className={styles.header}>
            {children}
        </header>
    )
}

Header.Title = function Title({children}: {children: ReactNode}){
    return(
        <div className={styles.titleContainer}>
            <h3 className={styles.title}>{children}</h3>
        </div>
    )
}

Header.LeftButton = function LeftButton({children}: {children: ReactNode}){
    return(
        <div className={styles.leftBtnContainer}>
            {children}
        </div>
    )
}

Header.RightButton = function RightButton({children}: {children: ReactNode}){
    return(
        <div className={styles.rghtBtnContainer}>
            {children}
        </div>
    )
}