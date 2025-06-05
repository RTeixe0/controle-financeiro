import { connectToDatabase } from '@/lib/mongodb'
// import { Alert } from '@/models/Alert' // Substituído pelo repositório
import { AlertRepository } from '@/infra/mongoose/repositories/AlertRepository'
import { CreateAlert } from '@/core/alerts/use-cases/CreateAlert'
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

    // const alertas = await Alert.find({ userId }).sort({ dataAlvo: 1 })
    // ^ Lógica substituída pelo AlertRepository
    const repo = new AlertRepository()
    const alertas = await repo.findByUser(userId)
    return NextResponse.json(alertas)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar alertas' }, { status: 500 })
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

    // const novo = await Alert.create({
    //   ...body,
    //   userId
    // })
    // ^ Lógica substituída pelo use-case CreateAlert
    const repo = new AlertRepository()
    const useCase = new CreateAlert(repo)
    const novo = await useCase.execute({
      ...body,
      userId
    })

    return NextResponse.json(novo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar alerta' }, { status: 500 })
  }
}
