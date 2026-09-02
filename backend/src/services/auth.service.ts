import {prisma} from '../config/db'
import bcrypt from 'bcrypt'
import { generateTokens } from '../utils/generateTokens'
import crypto from 'crypto'


export async function registerUser(email: string, password: string){
    const userExists = await prisma.app_users.findUnique({
        where: {email: email},
    })

    if(userExists){
        throw new Error("User with such email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.app_users.create({
        data: {email, password: hashedPassword}
    })

    const {accessToken, refreshToken} = generateTokens(user.id)

    const hash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 60)

    await prisma.app_sessions.create({
        data: {
            refresh_token_hash: hash,
            expires_at: expiresAt,
            user_id: user.id
        }
    })

    return {user, accessToken, refreshToken}
}

export async function loginUser(email: string, password: string){
    const user = await prisma.app_users.findUnique({
        where: {email: email},
    })

    if(!user){
        throw new Error("Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        throw new Error("Invalid email or password")
    }

    const {accessToken, refreshToken} = generateTokens(user.id)
        const hash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 60)

    await prisma.app_sessions.create({
        data: {
            refresh_token_hash: hash,
            expires_at: expiresAt,
            user_id: user.id
        }
    })

    return {user, accessToken, refreshToken}
}


export async function checkUser(userId: string){
    const user = await prisma.app_users.findUnique({
        where: {id: userId},
    })
    if(!user){
        throw new Error("User doesn't exist in data base")
    }
    return user
}

export async function refreshJWTToken(expiredRefreshToken: string){
    const hash = crypto
        .createHash('sha256')
        .update(expiredRefreshToken)
        .digest('hex')

    const session = await prisma.app_sessions.findUnique({
        where: {refresh_token_hash: hash}
    })

    if(!session){
        throw new Error("No such session in data base")
    }

    if(session.expires_at < new Date()){
        throw new Error("Refresh token expired")
    }
    const {accessToken, refreshToken} = generateTokens(session.user_id)

    const newHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 60)

    await prisma.app_sessions.update({
        where: {id: session.id},
        data: {refresh_token_hash: newHash, expires_at: expiresAt}
    })

    return {accessToken, refreshToken}
}

export async function logoutUser(refreshToken: string){
    const hash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex')

    const session = await prisma.app_sessions.delete({
        where: {refresh_token_hash: hash}
    })
    return session
}