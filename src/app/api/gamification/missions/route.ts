import { connectToDatabase } from '@/lib/mongodb'
// import { Gamification } from '@/models/Gamification' // Substituído pelo repositório
import { GamificationRepository } from '@/infra/mongoose/repositories/GamificationRepository'
import { AddMission } from '@/core/gamification/use-cases/AddMission'
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
    const userId = decoded.userId

    // const gamificacoes = await Gamification.find({ userId })
    // return NextResponse.json(gamificacoes.map(g => g.missoes).flat())
    // ^ Lógica substituída pelo GamificationRepository
    const repo = new GamificationRepository()
    const missoes = await repo.getMissions(userId)
    return NextResponse.json(missoes)
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

    // let registro = await Gamification.findOne({ userId })
    // if (!registro) {
    //   registro = await Gamification.create({ userId, missoes: [missao], conquistas: [] })
    // } else {
    //   registro.missoes.push(missao)
    //   await registro.save()
    // }
    // ^ Lógica substituída pelo use-case AddMission
    const repo = new GamificationRepository()
    const useCase = new AddMission(repo)
    const criado = await useCase.execute(userId, missao)

    return NextResponse.json(criado, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao registrar missão' }, { status: 500 })
  }
}
