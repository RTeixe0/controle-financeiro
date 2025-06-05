import { connectToDatabase } from '@/lib/mongodb'
// import { Asset } from '@/models/Asset' // Substituído pelo repositório
import { AssetRepository } from '@/infra/mongoose/repositories/AssetRepository'
import { CreateAsset } from '@/core/assets/use-cases/CreateAsset'
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

    // const ativos = await Asset.find({ userId }).sort({ dataAquisicao: -1 })
    // ^ Lógica substituída pelo AssetRepository
    const repo = new AssetRepository()
    const ativos = await repo.findByUser(userId)

    return NextResponse.json(ativos)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar ativos' }, { status: 500 })
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

    // const novo = await Asset.create({
    //   ...body,
    //   userId
    // })
    // ^ Lógica substituída pelo use-case CreateAsset
    const repo = new AssetRepository()
    const useCase = new CreateAsset(repo)
    const novo = await useCase.execute({
      ...body,
      userId
    })

    return NextResponse.json(novo, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar ativo' }, { status: 500 })
  }
}
