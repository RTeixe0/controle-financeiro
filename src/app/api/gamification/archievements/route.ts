import { connectToDatabase } from '@/lib/mongodb'
import { Gamification } from '@/models/Gamification'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectToDatabase()
  const gamificacoes = await Gamification.find()
  return NextResponse.json(gamificacoes.map(g => g.conquistas).flat())
}
