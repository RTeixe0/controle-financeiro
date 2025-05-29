import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  await connectToDatabase()

  const { email, senha } = await req.json()

  if (!email || !senha) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
  }

  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(senha, user.senhaHash))) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

  const res = NextResponse.json({ message: 'Login realizado com sucesso', userId: user._id })

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/'
  })

  return res
}
