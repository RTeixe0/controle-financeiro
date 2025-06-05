import { connectToDatabase } from '@/lib/mongodb'
// import { Gamification } from '@/models/Gamification' // Substituído pelo repositório
import { GamificationRepository } from '@/infra/mongoose/repositories/GamificationRepository'
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

    // const gamificacao = await Gamification.findOne({ userId })
    // ^ Lógica substituída pelo GamificationRepository
    const repo = new GamificationRepository()
    const conquistas = await repo.getArchievements(userId)
    return NextResponse.json(conquistas)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar conquistas' }, { status: 500 })
  }
}
