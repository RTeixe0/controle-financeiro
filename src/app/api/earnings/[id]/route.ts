import { connectToDatabase } from '@/lib/mongodb'
import { Earning } from '@/models/Earning'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()
  const atualizado = await Earning.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(atualizado)
}

export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase()
  await Earning.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Rendimento deletado' })
}
