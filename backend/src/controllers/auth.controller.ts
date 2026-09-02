import { Request, Response } from 'express'
import {registerUser, loginUser, checkUser, refreshJWTToken, logoutUser} from '../services/auth.service'

export async function register(req: Request, res: Response){
    try{
        const {email, password} = req.body
        const {user, refreshToken, accessToken} = await registerUser(email, password)
        res.cookie('jwt', refreshToken, {
            httpOnly: true,                                   
            secure: process.env.NODE_ENV === 'production',     
            sameSite: 'lax',                                    
            maxAge: 60 * 24 * 60 * 60 * 1000,                     
        })
        res.status(201).json({userId: user.id, email: user.email, accessToken})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function login(req: Request, res: Response){
    try{
        const {email, password} = req.body
        const {user, refreshToken, accessToken} = await loginUser(email, password)
        const isProduction = process.env.NODE_ENV === 'production'
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 60 * 24 * 60 * 60 * 1000,
        })
        res.status(201).json({userId: user.id, email: user.email, accessToken})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function logout(req: Request, res: Response){
    try{
        const refreshToken = req.cookies.jwt
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        if (refreshToken) {
            await logoutUser(refreshToken)
        }
        res.status(200).json({status: "success", message: "Logged out successfully"})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function checkMe(req: Request, res: Response){
    const userId = req.user.id
    try{
        const user = await checkUser(userId)
        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}

export async function refresh(req: Request, res: Response){
    try{
        const expiredRefreshToken = req.cookies.jwt
        const {refreshToken, accessToken} = await refreshJWTToken(expiredRefreshToken)
        res.cookie('jwt', refreshToken, {
            httpOnly: true,                                   
            secure: process.env.NODE_ENV === 'production',     
            sameSite: 'lax',                                    
            maxAge: 60 * 24 * 60 * 60 * 1000,                     
        })
        res.status(201).json({accessToken: accessToken})
    }catch(error){
        res.status(400).json({error: (error as Error).message})
    }
}