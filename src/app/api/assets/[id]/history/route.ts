import { connectToDatabase } from '@/lib/mongodb'
import { Asset } from '@/models/Asset'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function POST(req: Request, { params }: Params) {
  await connectToDatabase()
  const { data, valor } = await req.json()

  const ativo = await Asset.findById(params.id)
  if (!ativo) {
    return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 })
  }

  ativo.historicoDeValores.push({ data, valor })
  ativo.valorAtual = valor

  await ativo.save()
  return NextResponse.json(ativo)
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const ativo = await Asset.findById(params.id)
  if (!ativo) {
    return NextResponse.json({ error: 'Ativo não encontrado' }, { status: 404 })
  }
  return NextResponse.json(ativo.historicoDeValores || [])
}
