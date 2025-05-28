import mongoose, { Schema, Document, models } from 'mongoose'

export interface ICategory extends Document {
  userId: mongoose.Types.ObjectId
  nome: string
  tipo: 'receita' | 'despesa'
}

const CategorySchema = new Schema<ICategory>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['receita', 'despesa'], required: true }
})

export const Category = models.Category || mongoose.model<ICategory>('Category', CategorySchema)
