import { NextApiRequest } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '@/models/User'

const JWT_SECRET = process.env.JWT_SECRET as string

interface TokenPayload extends JwtPayload {
  userId: string
}

export async function getSessionUser(req: NextApiRequest) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    const user = await User.findById(decoded.userId)
    return user
  } catch {
    return null
  }
}
