import {useState, type FormEvent} from 'react'
import { Icon } from '@iconify/react'
import styles from './LoginPage.module.css'
import {register, login} from '../../api/auth'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {ROUTES} from '../../utils/constants'
import { useAuthState } from '../../context/AuthContext'

export default function LoginPage(){
    const [mode, setMode] = useState<"register" | "login">("login")
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const {continueAsGuest, markAsLoggedIn} = useAuthState()

    const loginMutation = useMutation({
        mutationFn: () => mode === "login" ? login(email, password) : register(email, password),
        onSuccess: () => {
            markAsLoggedIn()
            navigate(ROUTES.HOME)
        },
        onError: (err) => setError(err.message)
    })

    async function handleSubmit(e: FormEvent){
        e.preventDefault()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
            setError('Invalid email address')
            return
        }

        setError('')

        loginMutation.mutate()
    }
    
    function buttonText(){
        return mode === "register" ? loginMutation.isPending ? "Registering..." : "Register" :
        loginMutation.isPending ? "Loging in..." : "Log in"
    }

    function handleModeChange(mode: string){
        mode === "register" ? setMode("login") : setMode("register")
        setEmail("")
        setPassword("")

    }

    function handleGuestClick(){
        continueAsGuest()
        navigate(ROUTES.HOME)
    }
    return (
        <div className={styles.loginPageLayout}>
            <h1>{mode === "login" ? "Login" : "Register"}</h1>
            <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.inputField}>
                    <Icon icon="lineicons:envelope-1" width={20} height={20} />
                    <input 
                        placeholder="E-mail" 
                        value={email ?? ''} 
                        type="email"  
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                    />
                </div>

                <div className={styles.inputField}>
                    <Icon icon="mage:lock" width={20} height={20} />
                    <input 
                        placeholder="Password" 
                        value={password ?? ''} 
                        type="password"  
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError('')
                        }}
                    />
                </div>

                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={!email || !password || loginMutation.isPending}>{buttonText()}</button>
            </form> 

            {mode === "register" && 
                <div className={styles.noAccountOption}>
                    <button className={styles.noAccountBtn} onClick={handleGuestClick}>
                        Continue without account
                        <Icon icon="famicons:arrow-forward-sharp" width={16} height={16} />
                    </button>
                    <p className={styles.noAccountText}>(data saved locally only)</p>
                </div>
            }

            {mode === "register" ? <div className={styles.changeLoginWay}>Already have an account? 
                <span onClick={() => handleModeChange(mode)}> Login Now</span>
            </div>
                :
            <div className={styles.changeLoginWay}>Don't have an account?
                <span onClick={() => handleModeChange(mode)}> Register Now</span>
            </div>}
        </div>
    )
}