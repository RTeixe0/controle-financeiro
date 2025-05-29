import { connectToDatabase } from '@/lib/mongodb'
import { DebtPayment } from '@/models/DebtPayment'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

interface Params {
  params: { id: string }
}

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const pagamentos = await DebtPayment.find({ debtId: params.id, userId }).sort({ data: -1 })

    return NextResponse.json(pagamentos)
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err)
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const data = await req.json()

    const pagamento = await DebtPayment.create({
      ...data,
      debtId: params.id,
      userId
    })

    return NextResponse.json(pagamento, { status: 201 })
  } catch (err) {
    console.error('Erro ao registrar pagamento:', err)
    return NextResponse.json({ error: 'Erro ao registrar pagamento' }, { status: 500 })
  }
}
