import { connectToDatabase } from '@/lib/mongodb'
import { Earning } from '@/models/Earning'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const rendimentos = await Earning.find().sort({ dataRecebimento: -1 })
  return NextResponse.json(rendimentos)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const body = await req.json()
  const novo = await Earning.create(body)
  return NextResponse.json(novo, { status: 201 })
}
