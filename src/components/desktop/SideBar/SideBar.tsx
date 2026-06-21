import styles from './SideBar.module.css'
import { Icon } from '@iconify/react'
import {NavLink, useNavigate} from 'react-router-dom'
import { useExercisesStore } from '../../../store/exercises-store'
import { useUserStore } from '../../../store/user-store'
import logo from '../../../assets/logo.png'
import { logoutUser } from '../../../supabase/supabase_crud'
import { ROUTES } from '../../../routes'
export default function SideBar(){
    const setUserId = useUserStore((state) => state.setUserId)
    const clearExercisesStore = useExercisesStore(state => state.clearStore)
    const navigate = useNavigate()
    async function handleLogout(){
        setUserId('')
        navigate(ROUTES.HOME)
        await logoutUser()
    }

    return(
        <>
            <div className={styles.sideBarLayout}>
                <div className={styles.logo}>
                    <img src={logo} width={50} height={50}/>
                    <h1>Forge</h1>
                </div>
                <div className={styles.menu}>
                    <NavLink onClick={clearExercisesStore} to={ROUTES.HOME} className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="ic:baseline-history" width={24} height={24} />
                        History
                    </NavLink>
                    <NavLink onClick={clearExercisesStore} to={ROUTES.ROUTINES} className={({ isActive }) => 
                        isActive ? styles.btnActive : styles.btn
                    }>
                        <Icon icon="lucide:notebook-text" width={24} height={24} />
                        Routines
                    </NavLink>  
                </div>
                <NavLink onClick={handleLogout} to={ROUTES.HOME} className={`${styles.btn} ${styles.btnLogout}`}>
                    <Icon icon="ic:baseline-log-out" width={24} height={24} />
                    Log out
                </NavLink>
            </div>
        </>
    )
}
