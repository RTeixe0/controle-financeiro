import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(req: Request) {
  await connectToDatabase()

  const { email, senha } = await req.json()
  const user = await User.findOne({ email })

  if (!user || user.senhaHash !== senha) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  return NextResponse.json({ message: 'Login OK', userId: user._id })
}
