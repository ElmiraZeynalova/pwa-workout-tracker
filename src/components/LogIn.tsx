import { useUserStore } from "../store/user-store"
import {signInUser, verifyOtp} from "../supabaseDB"
import {useState} from 'react'

export default function LogIn(){
    const email = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)
    const [error, setError] = useState('')
    const [code, setCode] = useState('')
    const [loginStep, setLoginStep] = useState<'email' | 'otp'>('email')

    async function handleLogin() {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
            setError('Invalid email address')
            return
        }
        setError('')
        const { error } = await signInUser(email!)
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

        setError('')

        const { data, error } = await verifyOtp(email!, code)

        console.log('VERIFY RESULT:', data, error)

        if (error) {
            setError(error.message)
            return
        }

    }


    return (
        <>
            {loginStep === 'email' && 
                <form>
                    <label>Email:
                    <input 
                        placeholder="example@gmail.com" 
                        value={email ?? ''} 
                        type="email"  
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }}
                    />
                    </label>
                    {error && <p className="error">{error}</p>}
                    <button type="button" disabled={!email} onClick={handleLogin}>Log in</button>
                </form>}
            {loginStep === 'otp' && 
                <form>
                    <label>6-digit code:
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
                    </label>
                    {error && <p className="error">{error}</p>}
                    <button type="button" disabled={!code} onClick={handleVerify}>Verify</button>
                </form>}
        </>
    )
}