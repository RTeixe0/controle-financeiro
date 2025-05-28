import { connectToDatabase } from '@/lib/mongodb'
import { Debt } from '@/models/Debt'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const dividas = await Debt.find().sort({ dataVencimentoProxima: 1 })
  return NextResponse.json(dividas)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const body = await req.json()
  const nova = await Debt.create(body)
  return NextResponse.json(nova, { status: 201 })
}
