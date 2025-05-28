import { connectToDatabase } from '@/lib/mongodb'
import { Debt } from '@/models/Debt'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const divida = await Debt.findById(params.id)
  if (!divida) return NextResponse.json({ error: 'Não encontrada' }, { status: 404 })
  return NextResponse.json(divida)
}

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()
  const atualizada = await Debt.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(atualizada)
}

export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase()
  await Debt.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Dívida deletada' })
}
