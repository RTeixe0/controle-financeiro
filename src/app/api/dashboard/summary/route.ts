import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/models/Transaction'
import { Debt } from '@/models/Debt'
import { Asset } from '@/models/Asset'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

function getToken(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  if (!auth.startsWith('Bearer ')) return null
  return auth.split(' ')[1]
}

export async function GET(req: NextRequest) {
  const token = getToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JWTPayload

    await connectToDatabase()

    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const transAgg = await Transaction.aggregate([
      { $match: { userId, status: 'realizada' } },
      { $group: { _id: '$tipo', total: { $sum: '$valor' } } }
    ])

    let totalReceitas = 0
    let totalDespesas = 0
    for (const t of transAgg) {
      if (t._id === 'receita') totalReceitas = t.total
      if (t._id === 'despesa') totalDespesas = t.total
    }
    const saldoAtual = totalReceitas - totalDespesas

    const debtsAgg = await Debt.aggregate([
      { $match: { userId, status: 'ativa' } },
      { $group: { _id: null, total: { $sum: '$valorAtual' } } }
    ])
    const totalDividas = debtsAgg[0]?.total ?? 0

    const assetsAgg = await Asset.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$valorAtual' } } }
    ])
    const totalAtivos = assetsAgg[0]?.total ?? 0

    const patrimonioLiquido = totalAtivos - totalDividas

    return NextResponse.json({
      saldoAtual,
      totalReceitas,
      totalDespesas,
      totalDividas,
      patrimonioLiquido
    })
  } catch (error: any) {
    console.error(error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Erro ao gerar resumo' }, { status: 500 })
  }
}
