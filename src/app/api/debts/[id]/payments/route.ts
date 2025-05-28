import { connectToDatabase } from '@/lib/mongodb'
import { DebtPayment } from '@/models/DebtPayment'
import { NextResponse } from 'next/server'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const pagamentos = await DebtPayment.find({ debtId: params.id }).sort({ data: -1 })
  return NextResponse.json(pagamentos)
}

export async function POST(req: Request, { params }: Params) {
  await connectToDatabase()
  const data = await req.json()

  const pagamento = await DebtPayment.create({
    ...data,
    debtId: params.id
  })

  return NextResponse.json(pagamento, { status: 201 })
}
