import mongoose, { Schema, Document, models } from 'mongoose'

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId
  data: Date
  valor: number
  tipo: 'receita' | 'despesa'
  categoriaId: mongoose.Types.ObjectId
  descricao?: string
  formaPagamento?: string
  origem: 'manual' | 'importacao' | 'whatsapp'
  anexo?: string
  status: 'pendente' | 'realizada'
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Date, required: true },
  valor: { type: Number, required: true },
  tipo: { type: String, enum: ['receita', 'despesa'], required: true },
  categoriaId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  descricao: String,
  formaPagamento: String,
  origem: { type: String, enum: ['manual', 'importacao', 'whatsapp'], required: true },
  anexo: String,
  status: { type: String, enum: ['pendente', 'realizada'], default: 'realizada' }
})

export const Transaction =
  models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)
