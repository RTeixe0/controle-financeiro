import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/models/Category'
import { Transaction } from '@/models/Transaction'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

interface ParsedTransaction {
  data: Date
  valor: number
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao?: string
  formaPagamento?: string
}

async function handleTransactions(transacoes: ParsedTransaction[], userId: string) {
  const createdCategories: string[] = []
  for (const t of transacoes) {
    if (t.tipo !== 'receita' && t.tipo !== 'despesa') continue
    let categoria = await Category.findOne({ nome: t.categoria, tipo: t.tipo, userId })
    if (!categoria) {
      categoria = await Category.create({ nome: t.categoria, tipo: t.tipo, userId })
      createdCategories.push(categoria.nome)
    }
    await Transaction.create({
      userId,
      data: t.data,
      valor: t.valor,
      tipo: t.tipo,
      categoriaId: categoria._id,
      descricao: t.descricao,
      formaPagamento: t.formaPagamento,
      origem: 'importacao',
      status: 'realizada',
    })
  }
  return { count: transacoes.length, categoriesCreated: createdCategories.length }
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

    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'Arquivo ausente' }, { status: 400 })
      const text = await file.text()
      const Papa = (await import('papaparse')).default
      const parsed = Papa.parse<any>(text, { header: true, skipEmptyLines: true })
      const data: ParsedTransaction[] = (parsed.data || []).map((row: any) => ({
        data: new Date(row.data),
        valor: Number(row.valor),
        tipo: row.tipo as 'receita' | 'despesa',
        categoria: row.categoria,
        descricao: row.descricao,
        formaPagamento: row.formaPagamento,
      }))
      const result = await handleTransactions(data, userId)
      return NextResponse.json(result)
    } else {
      const body = await req.json()
      const arr: any[] = Array.isArray(body) ? body : []
      const data: ParsedTransaction[] = arr.map((t) => ({
        data: new Date(t.data),
        valor: Number(t.valor),
        tipo: t.tipo,
        categoria: t.categoria,
        descricao: t.descricao,
        formaPagamento: t.formaPagamento,
      }))
      const result = await handleTransactions(data, userId)
      return NextResponse.json(result)
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro ao importar transações' }, { status: 500 })
  }
}
