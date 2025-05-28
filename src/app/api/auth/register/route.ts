import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  await connectToDatabase()

  const { nome, email, senha } = await req.json()

  const existente = await User.findOne({ email })
  if (existente) {
    return NextResponse.json({ error: 'Email já registrado' }, { status: 400 })
  }

  const senhaHash = await bcrypt.hash(senha, 10)

  const novoUsuario = new User({ nome, email, senhaHash })
  await novoUsuario.save()

  return NextResponse.json({ message: 'Usuário registrado com sucesso' }, { status: 201 })
}
