import SideBar from '../components/desktop/SideBar/SideBar'
import styles from './DesktopLayout.module.css'
import type { ReactNode } from 'react'

type Props = {
    children: ReactNode
    rightPanel?: ReactNode  
}

export default function DesktopLayout({ children, rightPanel }: Props) {
    return (
        <div className={styles.layout}>
            <SideBar/>
            {children}
            {rightPanel && rightPanel}
        </div>
    )
}