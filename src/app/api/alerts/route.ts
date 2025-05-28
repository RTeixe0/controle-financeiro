import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const alertas = await Alert.find().sort({ dataAlvo: 1 })
  return NextResponse.json(alertas)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const data = await req.json()
  const novo = await Alert.create(data)
  return NextResponse.json(novo, { status: 201 })
}
