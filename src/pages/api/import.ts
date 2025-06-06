import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/lib/mongodb'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import Papa from 'papaparse'
import { Category } from '@/models/Category'
import { Transaction } from '@/models/Transaction'

interface JWTPayload {
  userId: string
  email?: string
  iat: number
  exp: number
}

const upload = multer({ storage: multer.memoryStorage() })

interface ParsedTransaction {
  data: Date
  valor: number
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao?: string
  formaPagamento?: string
}

function parseCsv(content: string): ParsedTransaction[] {
  const parsed = Papa.parse<Omit<ParsedTransaction, 'data' | 'valor'> & { data: string; valor: string }>(content, {
    header: true,
    skipEmptyLines: true
  })
  return (parsed.data || []).map((row) => ({
    data: new Date(row.data),
    valor: Number(row.valor),
    tipo: row.tipo as 'receita' | 'despesa',
    categoria: row.categoria,
    descricao: row.descricao,
    formaPagamento: row.formaPagamento
  }))
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
      status: 'realizada'
    })
  }
  return { count: transacoes.length, categoriesCreated: createdCategories.length }
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, callback: (err?: unknown) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result?: unknown) => {
      if (result instanceof Error) return reject(result)
      return resolve(result)
    })
  })
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  await connectToDatabase()

  try {
    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token ausente' })
    }
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload
    const userId = decoded.userId

    await runMiddleware(req, res, upload.single('file'))

    if (req.file) {
      const content = req.file.buffer.toString('utf-8')
      const transacoes = parseCsv(content)
      const result = await handleTransactions(transacoes, userId)
      return res.status(200).json(result)
    } else if (req.body && Object.keys(req.body).length) {
      const parsed: ParsedTransaction[] = (Array.isArray(req.body) ? req.body : [])
        .map((t) => ({
          data: new Date(t.data),
          valor: Number(t.valor),
          tipo: t.tipo,
          categoria: t.categoria,
          descricao: t.descricao,
          formaPagamento: t.formaPagamento
        }))
      const result = await handleTransactions(parsed, userId)
      return res.status(200).json(result)
    }

    return res.status(400).json({ error: 'Nenhum dado fornecido' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro ao importar transações' })
  }
}
