import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/models/Transaction'
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

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    startDate.setMonth(startDate.getMonth() - 5)
    startDate.setDate(1)

    const receitasDespesasAgg = await Transaction.aggregate([
      { $match: { userId, status: 'realizada', data: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: '$data' }, month: { $month: '$data' } },
          receitas: {
            $sum: { $cond: [{ $eq: ['$tipo', 'receita'] }, '$valor', 0] }
          },
          despesas: {
            $sum: { $cond: [{ $eq: ['$tipo', 'despesa'] }, '$valor', 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const receitasDespesasPorMes = receitasDespesasAgg.map((r) => ({
      mes: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
      receitas: r.receitas,
      despesas: r.despesas
    }))

    const saldoPorMes = receitasDespesasPorMes.map((item) => ({
      mes: item.mes,
      saldo: item.receitas - item.despesas
    }))

    const despesasPorCategoria = await Transaction.aggregate([
      { $match: { userId, status: 'realizada', tipo: 'despesa' } },
      { $group: { _id: '$categoriaId', total: { $sum: '$valor' } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      { $unwind: '$categoria' },
      { $project: { _id: 0, categoria: '$categoria.nome', total: 1 } }
    ])

    return NextResponse.json({
      receitasDespesasPorMes,
      despesasPorCategoria,
      saldoPorMes
    })
  } catch (error: any) {
    console.error(error)
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Erro ao gerar insights' }, { status: 500 })
  }
}
