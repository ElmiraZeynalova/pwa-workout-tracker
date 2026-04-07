import { useUserStore } from "../zustand_store/user-store"
import {signInUser, verifyOtp} from "../supabaseDB"
import {useState} from 'react'
import { FaRegEnvelope } from "react-icons/fa";
import { BiDialpadAlt } from "react-icons/bi";
export default function LoginPage(){
    const email = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)
    const [error, setError] = useState('')
    const [code, setCode] = useState('')
    const [loginStep, setLoginStep] = useState<'email' | 'otp'>('email')
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
        setLoginStep('otp')
    }
    async function handleVerify() {
        if (code.length !== 6) {
            setError('Enter 6-digit code')
            return
        }
        setLoading(true)
        setError('')

        const { error } = await verifyOtp(email!, code)
        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

    }


    return (
        <>
            {loginStep === 'email' && 
            <div className="login-page-layout">
                <h1>Login</h1>
                <p>Please Sign in to continue</p>
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
                    <button type="button" disabled={!email || loading} onClick={handleLogin}>{loading ? 'Sending...' : 'Login'}</button>
                
            </div>}
            {loginStep === 'otp' && 
            <div className="login-page-layout">
                <h1>Verify your email</h1>
                <p>Enter the code sent to {email}:</p>
                <form>
                    <BiDialpadAlt color="black" size={20}/>
                    <input 
                        type="text" 
                        inputMode="numeric" 
                        maxLength={6}
                        placeholder="123456" 
                        value={code ?? ''}  
                        onChange={(e) => {
                            setCode(e.target.value)
                            setError('')
                        }}
                    />
                    </form>
                    {error && <p className="error">{error}</p>}
                     <button type="button" disabled={code.length !== 6 || loading} onClick={handleVerify}>{loading ? 'Verifying...' : 'Verify'}</button>
                </div>}
        </>
    )
}