import { connectToDatabase } from '@/lib/mongodb'
// import { Debt } from '@/models/Debt' // Substituído pelo repositório
import { DebtRepository } from '@/infra/mongoose/repositories/DebtRepository'
import { CreateDebt } from '@/core/debts/use-cases/CreateDebt'
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

    // const dividas = await Debt.find({ userId }).sort({ dataVencimentoProxima: 1 })
    // ^ Lógica substituída pelo TransactionRepository
    const repo = new DebtRepository()
    const dividas = await repo.findByUser(userId)

    return NextResponse.json(dividas)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar dívidas' }, { status: 500 })
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
    const userId = decoded.userId

    const body = await req.json()

    // const nova = await Debt.create({
    //   ...body,
    //   userId
    // })
    // ^ Lógica substituída pelo use-case CreateDebt
    const repo = new DebtRepository()
    const useCase = new CreateDebt(repo)
    const nova = await useCase.execute({
      ...body,
      userId
    })

    return NextResponse.json(nova, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar dívida' }, { status: 500 })
  }
}
