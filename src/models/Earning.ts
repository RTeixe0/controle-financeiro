import mongoose, { Schema, Document, models } from 'mongoose'

export interface IEarning extends Document {
  userId: mongoose.Types.ObjectId
  tipo: 'fixo' | 'variavel'
  valorBruto: number
  descontos?: number
  valorLiquido: number
  dataRecebimento: Date
  fonte: string
  observacao?: string
}

const EarningSchema = new Schema<IEarning>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, enum: ['fixo', 'variavel'], required: true },
  valorBruto: { type: Number, required: true },
  descontos: { type: Number, default: 0 },
  valorLiquido: { type: Number, required: true },
  dataRecebimento: { type: Date, required: true },
  fonte: { type: String, required: true },
  observacao: String
})

export const Earning = models.Earning || mongoose.model<IEarning>('Earning', EarningSchema)
