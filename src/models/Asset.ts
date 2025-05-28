import mongoose, { Schema, Document, models } from 'mongoose'

interface IValorHistorico {
  data: Date
  valor: number
}

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId
  nome: string
  tipo: 'imóvel' | 'veículo' | 'investimento' | 'outro'
  valorAtual: number
  dataAquisicao: Date
  historicoDeValores: IValorHistorico[]
  observacao?: string
}

const AssetSchema = new Schema<IAsset>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nome: { type: String, required: true },
  tipo: {
    type: String,
    enum: ['imóvel', 'veículo', 'investimento', 'outro'],
    required: true
  },
  valorAtual: { type: Number, required: true },
  dataAquisicao: { type: Date, required: true },
  historicoDeValores: [
    {
      data: Date,
      valor: Number
    }
  ],
  observacao: String
})

export const Asset = models.Asset || mongoose.model<IAsset>('Asset', AssetSchema)
