import mongoose, { Schema, Document, models } from 'mongoose'

export interface IDebtPayment extends Document {
  debtId: mongoose.Types.ObjectId
  data: Date
  valor: number
  formaPagamento?: string
  status: 'realizado' | 'agendado' | 'atrasado'
}

const DebtPaymentSchema = new Schema<IDebtPayment>({
  debtId: { type: Schema.Types.ObjectId, ref: 'Debt', required: true },
  data: { type: Date, required: true },
  valor: { type: Number, required: true },
  formaPagamento: String,
  status: {
    type: String,
    enum: ['realizado', 'agendado', 'atrasado'],
    default: 'realizado'
  }
})

export const DebtPayment =
  models.DebtPayment || mongoose.model<IDebtPayment>('DebtPayment', DebtPaymentSchema)
