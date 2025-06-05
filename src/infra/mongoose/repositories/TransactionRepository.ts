import mongoose from 'mongoose'
import { Transaction as TransactionModel } from '@/models/Transaction'
import { Transaction } from '@/core/transactions/entities/Transaction'

export class TransactionRepository {
  async create(data: Transaction) {
    const userId = new mongoose.Types.ObjectId(data.userId)
    const categoriaId = new mongoose.Types.ObjectId(data.categoriaId)
    const created = await TransactionModel.create({
      ...data,
      userId,
      categoriaId
    })
    return created
  }

  async findByUser(userId: mongoose.Types.ObjectId) {
    return TransactionModel.find({ userId }).sort({ data: -1 })
  }
}
