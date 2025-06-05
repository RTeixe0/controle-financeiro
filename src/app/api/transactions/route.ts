import { connectToDatabase } from '@/lib/mongodb'
// import { Transaction } from '@/models/Transaction' // Substituído pelo repositório
import { TransactionRepository } from '@/infra/mongoose/repositories/TransactionRepository'
import { CreateTransaction } from '@/core/transactions/use-cases/CreateTransaction'
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

    // const transacoes = await Transaction.find({ userId }).sort({ data: -1 })
    // ^ Lógica substituída pelo repositório e use-case
    const repo = new TransactionRepository()
    const transacoes = await repo.findByUser(userId)

    return NextResponse.json(transacoes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar transações' }, { status: 500 })
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

    // const categoriaId = new mongoose.Types.ObjectId(body.categoriaId)
    // const nova = await Transaction.create({
    //   ...body,
    //   userId,
    //   categoriaId
    // })
    // ^ Lógica substituída pelo use-case CreateTransaction
    const repo = new TransactionRepository()
    const useCase = new CreateTransaction(repo)
    const nova = await useCase.execute({
      ...body,
      userId
    })

    return NextResponse.json(nova, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 })
  }
}
