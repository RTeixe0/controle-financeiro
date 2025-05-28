import { connectToDatabase } from '@/lib/mongodb'
import { Transaction } from '@/models/Transaction'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const transacoes = await Transaction.find().sort({ data: -1 })
  return NextResponse.json(transacoes)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const body = await req.json()

  const nova = await Transaction.create(body)
  return NextResponse.json(nova, { status: 201 })
}
