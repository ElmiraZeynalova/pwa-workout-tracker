import {apiClient} from './client'

export async function register(email: string, password: string){
    const {data} = await apiClient.post("/auth/register", {email, password})
    return data 
}

export async function login(email: string, password: string){
    const {data} = await apiClient.post("/auth/login", {email, password})
    return data 
}

export async function logout(){
    const {data} = await apiClient.post("/auth/logout")
    return data 
}

export async function userIsValid(){
    const {data} = await apiClient.get("/auth/me")
    return data
}

export async function refreshToken(){
    const {data} = await apiClient.get("/auth/refresh")
    return data
}