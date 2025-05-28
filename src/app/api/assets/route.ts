import { connectToDatabase } from '@/lib/mongodb'
import { Asset } from '@/models/Asset'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const ativos = await Asset.find().sort({ dataAquisicao: -1 })
  return NextResponse.json(ativos)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const data = await req.json()
  const novo = await Asset.create(data)
  return NextResponse.json(novo, { status: 201 })
}
