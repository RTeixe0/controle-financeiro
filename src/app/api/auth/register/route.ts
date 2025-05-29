import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function POST(req: Request) {
  await connectToDatabase()

  const { nome, email, senha } = await req.json()

  const existente = await User.findOne({ email })
  if (existente) {
    return NextResponse.json({ error: 'Email já registrado' }, { status: 400 })
  }

  const senhaHash = senha // ← vamos criptografar isso depois com bcrypt

  const novoUsuario = new User({ nome, email, senhaHash })
  await novoUsuario.save()

  return NextResponse.json({ message: 'Usuário registrado com sucesso' }, { status: 201 })
}
