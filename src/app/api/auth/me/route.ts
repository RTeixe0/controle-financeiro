import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    return NextResponse.json({ authenticated: true, user: { userId: payload.userId } })
  } catch (err) {
    console.error('Erro ao verificar token:', err)
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 })
  }
}
