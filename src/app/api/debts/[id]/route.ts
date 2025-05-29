import { connectToDatabase } from '@/lib/mongodb'
import { Debt } from '@/models/Debt'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

interface Params {
  params: { id: string }
}

interface JWTPayload {
  userId: string
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

    const divida = await Debt.findOne({ _id: params.id, userId })
    if (!divida) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 })

    return NextResponse.json(divida)
  } catch (err) {
    console.error('Erro no GET /debt/:id:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const data = await req.json()
    const atualizada = await Debt.findOneAndUpdate({ _id: params.id, userId }, data, { new: true })

    if (!atualizada)
      return NextResponse.json({ error: 'Dívida não encontrada ou sem permissão' }, { status: 404 })

    return NextResponse.json(atualizada)
  } catch (err) {
    console.error('Erro no PUT /debt/:id:', err)
    return NextResponse.json({ error: 'Erro ao atualizar dívida' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const deletada = await Debt.findOneAndDelete({ _id: params.id, userId })
    if (!deletada)
      return NextResponse.json({ error: 'Dívida não encontrada ou sem permissão' }, { status: 404 })

    return NextResponse.json({ message: 'Dívida deletada com sucesso' })
  } catch (err) {
    console.error('Erro no DELETE /debt/:id:', err)
    return NextResponse.json({ error: 'Erro ao deletar dívida' }, { status: 500 })
  }
}
