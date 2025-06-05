import mongoose from 'mongoose'
import { Alert as AlertModel } from '@/models/Alert'
import { Alert } from '@/core/alerts/entities/Alert'

export class AlertRepository {
  async create(data: Alert) {
    const userId = new mongoose.Types.ObjectId(data.userId)
    const created = await AlertModel.create({
      ...data,
      userId
    })
    return created
  }

  async findByUser(userId: mongoose.Types.ObjectId) {
    return AlertModel.find({ userId }).sort({ dataAlvo: 1 })
  }
}
