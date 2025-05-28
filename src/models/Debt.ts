import mongoose, { Schema, Document, models } from 'mongoose'

export interface IDebt extends Document {
  userId: mongoose.Types.ObjectId
  nome: string
  valorOriginal: number
  valorAtual: number
  juros?: number
  dataContratacao: Date
  parcelasTotais: number
  parcelasPagas: number
  dataVencimentoProxima: Date
  status: 'ativa' | 'quitada' | 'renegociando'
  observacao?: string
}

const DebtSchema = new Schema<IDebt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nome: { type: String, required: true },
  valorOriginal: { type: Number, required: true },
  valorAtual: { type: Number, required: true },
  juros: Number,
  dataContratacao: { type: Date, required: true },
  parcelasTotais: { type: Number, required: true },
  parcelasPagas: { type: Number, required: true },
  dataVencimentoProxima: { type: Date, required: true },
  status: {
    type: String,
    enum: ['ativa', 'quitada', 'renegociando'],
    default: 'ativa'
  },
  observacao: String
})

export const Debt = models.Debt || mongoose.model<IDebt>('Debt', DebtSchema)
