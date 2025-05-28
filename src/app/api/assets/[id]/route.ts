import { connectToDatabase } from '@/lib/mongodb'
import { Asset } from '@/models/Asset'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const ativo = await Asset.findById(params.id)
  return ativo
    ? NextResponse.json(ativo)
    : NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 })
}

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()
  const atualizado = await Asset.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(atualizado)
}

export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase()
  await Asset.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Ativo deletado' })
}
