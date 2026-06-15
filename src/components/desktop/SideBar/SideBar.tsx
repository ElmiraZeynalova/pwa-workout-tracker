import styles from './SideBar.module.css'
import { Icon } from '@iconify/react'
import {NavLink} from 'react-router-dom'
import { useExercisesStore } from '../../../store/exercises-store'
import { useUserStore } from '../../../store/user-store'
import logo from '../../../assets/logo.png'
export default function SideBar(){
    const setUserId = useUserStore((state) => state.setUserId)
    const clearExercisesStore = useExercisesStore(state => state.clearStore)
    return(
        <>
            <div className={styles.sideBarLayout}>
                <div className={styles.logo}>
                    <img src={logo} width={50} height={50}/>
                    <h1>FORGE</h1>
                </div>
                <div className={styles.menu}>
                    <NavLink onClick={clearExercisesStore} to="/" className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="ic:baseline-history" width={24} height={24} />
                        History
                    </NavLink>
                    <NavLink onClick={clearExercisesStore} to="/routines" className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="lucide:notebook-text" width={24} height={24} />
                        Routines
                    </NavLink>  
                </div>
                <NavLink onClick={() => setUserId('')} to="/" className={`${styles.btn} ${styles.btnLogout}`}>
                    <Icon icon="ic:baseline-log-out" width={24} height={24} />
                    Log out
                </NavLink>
            </div>
        </>
    )
}
