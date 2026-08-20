import {prisma} from '../config/db'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken'

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

    const token = generateToken(user.id)

    return {user: user, token: token}
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

    const token = generateToken(user.id)
    return {user: user, token: token}
}

