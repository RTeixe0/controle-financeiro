import { connectToDatabase } from '@/lib/mongodb'
import { TransactionRepository } from '@/infra/mongoose/repositories/TransactionRepository'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Parser as Json2CsvParser } from 'json2csv'

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

export async function GET(req: NextRequest) {
  await connectToDatabase()

  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token ausente' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
    const userId = new mongoose.Types.ObjectId(decoded.userId)

    const repo = new TransactionRepository()
    const transacoes = await repo.findByUser(userId)

    const format = req.nextUrl.searchParams.get('format') || 'json'

    if (format === 'csv') {
      const parser = new Json2CsvParser({
        fields: [
          { label: 'data', value: 'data' },
          { label: 'valor', value: 'valor' },
          { label: 'tipo', value: 'tipo' },
          { label: 'categoriaId', value: 'categoriaId' },
          { label: 'descricao', value: 'descricao' },
          { label: 'formaPagamento', value: 'formaPagamento' },
          { label: 'origem', value: 'origem' },
          { label: 'status', value: 'status' }
        ],
      })
      const csv = parser.parse(JSON.parse(JSON.stringify(transacoes)))

      const headers = new Headers({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="transactions.csv"'
      })

      return new NextResponse(csv, { headers })
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="transactions.json"'
    })

    return NextResponse.json(transacoes, { headers })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao exportar transações' }, { status: 500 })
  }
}
