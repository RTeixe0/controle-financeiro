import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, context: { params: { id: string } }) {
  await connectToDatabase()
  const data = await request.json()
  const atualizado = await Alert.findByIdAndUpdate(context.params.id, data, { new: true })
  return NextResponse.json(atualizado)
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  await connectToDatabase()
  await Alert.findByIdAndDelete(context.params.id)
  return NextResponse.json({ message: 'Alerta deletado' })
}
