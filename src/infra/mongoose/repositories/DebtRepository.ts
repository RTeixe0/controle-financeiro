import mongoose from 'mongoose'
import { Debt as DebtModel } from '@/models/Debt'
import { Debt } from '@/core/debts/entities/Debt'

export class DebtRepository {
  async create(data: Debt) {
    const userId = new mongoose.Types.ObjectId(data.userId)
    const created = await DebtModel.create({
      ...data,
      userId
    })
    return created
  }

  async findByUser(userId: mongoose.Types.ObjectId) {
    return DebtModel.find({ userId }).sort({ dataVencimentoProxima: 1 })
  }
}
