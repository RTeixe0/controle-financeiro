import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/models/Category'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function PUT(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()
  const atualizada = await Category.findByIdAndUpdate(params.id, data, { new: true })
  return NextResponse.json(atualizada)
}

export async function DELETE(_: Request, { params }: Params) {
  await connectToDatabase()
  await Category.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Categoria deletada' })
}
