import { connectToDatabase } from '@/lib/mongodb'
import { Gamification } from '@/models/Gamification'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const gamificacoes = await Gamification.find({ userId })
    return NextResponse.json(gamificacoes.map(g => g.missoes).flat())
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar gamificações' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const { missao } = await req.json()

    let registro = await Gamification.findOne({ userId })

    if (!registro) {
      registro = await Gamification.create({ userId, missoes: [missao], conquistas: [] })
    } else {
      registro.missoes.push(missao)
      await registro.save()
    }

    return NextResponse.json(registro.missoes.at(-1), { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao registrar missão' }, { status: 500 })
  }
}
