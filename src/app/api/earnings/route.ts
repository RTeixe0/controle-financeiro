import { connectToDatabase } from '@/lib/mongodb'
// import { Earning } from '@/models/Earning' // Substituído pelo repositório
import { EarningRepository } from '@/infra/mongoose/repositories/EarningRepository'
import { CreateEarning } from '@/core/earnings/use-cases/CreateEarning'
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

    // const rendimentos = await Earning.find({ userId }).sort({ dataRecebimento: -1 })
    // ^ Lógica substituída pelo EarningRepository
    const repo = new EarningRepository()
    const rendimentos = await repo.findByUser(userId)

    return NextResponse.json(rendimentos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar rendimentos' }, { status: 500 })
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

    const body = await req.json()

    // const novo = await Earning.create({
    //   ...body,
    //   userId
    // })
    // ^ Lógica substituída pelo use-case CreateEarning
    const repo = new EarningRepository()
    const useCase = new CreateEarning(repo)
    const novo = await useCase.execute({
      ...body,
      userId
    })

    return NextResponse.json(novo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar rendimento' }, { status: 500 })
  }
}
