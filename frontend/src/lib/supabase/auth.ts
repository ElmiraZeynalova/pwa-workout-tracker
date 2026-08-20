import {supabase} from './client'

export async function logoutUser(){
    await supabase.auth.signOut()
}

export async function signInUser(email: string){
    const { error } = await supabase.auth.signInWithOtp({ email: email })
    return { error }
}

export async function verifyOtp(email: string, code: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code, 
        type: 'email'
    })

    return { data, error }
}
