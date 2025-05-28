import mongoose, { Schema, Document, models } from 'mongoose'

interface IMissao {
  nome: string
  descricao: string
  status: 'ativa' | 'concluida'
  dataInicio: Date
  dataFim?: Date
  recompensa?: string
}

interface IConquista {
  nome: string
  descricao: string
  dataConquista: Date
}

export interface IGamification extends Document {
  userId: mongoose.Types.ObjectId
  missoes: IMissao[]
  conquistas: IConquista[]
}

const GamificationSchema = new Schema<IGamification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  missoes: [
    {
      nome: String,
      descricao: String,
      status: { type: String, enum: ['ativa', 'concluida'], default: 'ativa' },
      dataInicio: Date,
      dataFim: Date,
      recompensa: String
    }
  ],
  conquistas: [
    {
      nome: String,
      descricao: String,
      dataConquista: Date
    }
  ]
})

export const Gamification =
  models.Gamification || mongoose.model<IGamification>('Gamification', GamificationSchema)
