import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import {prisma} from '../config/db'

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.jwt   
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id: string}

    const user = await prisma.app_users.findUnique({
        where: {id: decoded.id},
    })

    if(!user){
        return res.status(401).json({error: "User no longer exists"})
    }

    req.user = {id: decoded.id}

    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}