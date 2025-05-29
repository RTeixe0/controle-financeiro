import mongoose, { Schema, Document, models } from 'mongoose'

export interface IUser extends Document {
  nome: string
  email: string
  senhaHash: string
  criadoEm: Date
}

const UserSchema = new Schema<IUser>({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now }
})

export const User = models.User || mongoose.model<IUser>('User', UserSchema)
