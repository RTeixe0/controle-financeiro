import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/models/Category'
import { NextRequest, NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(_: NextRequest, { params }: Params) {
  await connectToDatabase()

  const categoria = await Category.findById(params.id)

  if (!categoria) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
  }

  return NextResponse.json(categoria)
}

export async function PUT(req: NextRequest, { params }: Params) {
  await connectToDatabase()

  const categoria = await Category.findById(params.id)
  if (!categoria) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
  }

  const data = await req.json()
  const atualizada = await Category.findByIdAndUpdate(params.id, data, { new: true })

  return NextResponse.json(atualizada)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  await connectToDatabase()

  const categoria = await Category.findById(params.id)
  if (!categoria) {
    return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 })
  }

  await Category.findByIdAndDelete(params.id)
  return NextResponse.json({ message: 'Categoria deletada' })
}
