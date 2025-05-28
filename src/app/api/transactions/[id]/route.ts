import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/models/Transaction'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const transacao = await Transaction.findById(params.id)
  if (!transacao) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 })
  return NextResponse.json(transacao)
}

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()
  const atualizada = await Transaction.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(atualizada)
}

export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase()
  await Transaction.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Transação deletada' })
}
