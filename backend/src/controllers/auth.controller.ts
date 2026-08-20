import { Request, Response } from 'express'
import {registerUser, loginUser} from '../services/auth.service'

export async function register(req: Request, res: Response){
    try{
        const {email, password} = req.body
        const {user, token} = await registerUser(email, password)
        res.cookie('jwt', token, {
            httpOnly: true,                                   
            secure: process.env.NODE_ENV === 'production',     
            sameSite: 'lax',                                    
            maxAge: 7 * 24 * 60 * 60 * 1000,                     
        })
        res.status(201).json({email: user.email, password: user.password})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function login(req: Request, res: Response){
    try{
        const {email, password} = req.body
        const {user, token} = await loginUser(email, password)
        res.cookie('jwt', token, {
                httpOnly: true,                                   
                secure: process.env.NODE_ENV === 'production',     
                sameSite: 'lax',                                    
                maxAge: 7 * 24 * 60 * 60 * 1000,                     
            })
        res.status(201).json({email: user.email, password: user.password})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function logout(req: Request, res: Response){
    try{
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        res.status(200).json({status: "success", message: "Logged out successfully"})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}