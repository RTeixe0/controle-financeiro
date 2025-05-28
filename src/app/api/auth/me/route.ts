import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ authenticated: true, user: payload })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
