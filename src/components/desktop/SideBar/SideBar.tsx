import styles from './SideBar.module.css'
import { Icon } from '@iconify/react'
import {NavLink} from 'react-router-dom'

export default function SideBar(){
    return(
        <>
            <div className={styles.sideBarLayout}>
                <div className={styles.logo}></div>
                <div className={styles.menu}>
                    <NavLink to="/" className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="ic:baseline-format-list-bulleted" width={24} height={24} />
                        History
                    </NavLink>
                    <NavLink to="/routines" className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="ep:notebook" width={24} height={24} />
                        Routines
                    </NavLink>
                </div>
            </div>
        </>
    )
}