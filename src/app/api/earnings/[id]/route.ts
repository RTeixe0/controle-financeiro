import { connectToDatabase } from '@/lib/mongodb'
import { Earning } from '@/models/Earning'
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

export async function PUT(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const data = await req.json()

    const atualizado = await Earning.findOneAndUpdate({ _id: params.id, userId }, data, {
      new: true
    })

    if (!atualizado)
      return NextResponse.json(
        { error: 'Rendimento não encontrado ou sem permissão' },
        { status: 404 }
      )

    return NextResponse.json(atualizado)
  } catch (err) {
    console.error('Erro ao atualizar rendimento:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  try {
    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ error: 'Token ausente' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const deletado = await Earning.findOneAndDelete({ _id: params.id, userId })

    if (!deletado)
      return NextResponse.json(
        { error: 'Rendimento não encontrado ou sem permissão' },
        { status: 404 }
      )

    return NextResponse.json({ message: 'Rendimento deletado com sucesso' })
  } catch (err) {
    console.error('Erro ao deletar rendimento:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
