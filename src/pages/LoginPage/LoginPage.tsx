import { useUserStore } from '../../store/user-store'
import {signInUser} from '../../supabase/supabase_crud'
import {useState} from 'react'
import { FaRegEnvelope } from "react-icons/fa";
import styles from './LoginPage.module.css'

export default function LoginPage(){
    const email = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)
    const [error, setError] = useState('')
    const [loginStep, setLoginStep] = useState<'email' | 'link-sent'>('email')
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
            setError('Invalid email address')
            return
        }
        setLoading(true)
        setError('')
        const { error } = await signInUser(email!)
        setLoading(false)
        if (error) {
            setError(error.message)
            return
        }
        setLoginStep('link-sent')
    }

    return (
        <>
        
            {loginStep === 'email' && <div className={styles.loginPageLayout}>
                <h1>Log in</h1>
                <p>Enter your email to receive a sign-in link</p>
                <form>
                    <FaRegEnvelope color="black" size={20} />
                    <input 
                        placeholder="example@gmail.com" 
                        value={email ?? ''} 
                        type="email"  
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                    />
                </form>
                    {error && <p className="error">{error}</p>}
                    <button type="button" disabled={!email || loading} onClick={handleLogin}>{loading ? 'Sending...' : 'Log in'}</button>
                
            </div>}
            {loginStep === 'link-sent' && 
            <div className={styles.loginPageLayout}>
                <h2>Check your email</h2>
                <p>We sent a sign-in link to <strong>{email}</strong></p>
            </div>}
        </>
    )
}