import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/models/Category'
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

    const categorias = await Category.find({ userId }).sort({ nome: 1 })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 })
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

    const novaCategoria = await Category.create({
      ...body,
      userId
    })

    return NextResponse.json(novaCategoria, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 })
  }
}
