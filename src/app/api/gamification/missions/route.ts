import { connectToDatabase } from '@/lib/mongodb'
import { Gamification } from '@/models/Gamification'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const gamificacoes = await Gamification.find()
  return NextResponse.json(gamificacoes.map(g => g.missoes).flat())
}

export async function POST(req: Request) {
  await connectToDatabase()
  const { userId, missao } = await req.json()

  let registro = await Gamification.findOne({ userId })

  if (!registro) {
    registro = await Gamification.create({ userId, missoes: [missao], conquistas: [] })
  } else {
    registro.missoes.push(missao)
    await registro.save()
  }

  return NextResponse.json(registro.missoes.at(-1), { status: 201 })
}
