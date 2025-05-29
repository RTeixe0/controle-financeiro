import { connectToDatabase } from '@/lib/mongodb'
import { Category } from '@/models/Category'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const categorias = await Category.find()
  return NextResponse.json(categorias)
}

export async function POST(req: Request) {
  await connectToDatabase()
  const body = await req.json()
  const novaCategoria = await Category.create(body)
  return NextResponse.json(novaCategoria, { status: 201 })
}
