import mongoose, { Schema, Document, models } from 'mongoose'

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId
  tipo: string // Ex: 'conta', 'divida', 'meta', etc
  dataAlvo: Date
  mensagem: string
  status: 'pendente' | 'lido'
}

const AlertSchema = new Schema<IAlert>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: { type: String, required: true },
  dataAlvo: { type: Date, required: true },
  mensagem: { type: String, required: true },
  status: {
    type: String,
    enum: ['pendente', 'lido'],
    default: 'pendente'
  }
})

export const Alert = models.Alert || mongoose.model<IAlert>('Alert', AlertSchema)
