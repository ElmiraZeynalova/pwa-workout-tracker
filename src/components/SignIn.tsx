import { useUserStore } from "../store/user-store"
import {signInUser} from "../supabaseDB"

export default function SignIn(){
    const email = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)

    return(
        <form>
            <label>Email:
                <input placeholder="example@gmail.com" value={email ?? ''} type="text"  onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <button type="button" disabled={!email} onClick={() => email && signInUser(email)}>Log in</button>
        </form>
    )
}