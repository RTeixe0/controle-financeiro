import mongoose from 'mongoose'
import { Earning as EarningModel } from '@/models/Earning'
import { Earning } from '@/core/earnings/entities/Earning'

export class EarningRepository {
  async create(data: Earning) {
    const userId = new mongoose.Types.ObjectId(data.userId)
    const created = await EarningModel.create({
      ...data,
      userId
    })
    return created
  }

  async findByUser(userId: mongoose.Types.ObjectId) {
    return EarningModel.find({ userId }).sort({ dataRecebimento: -1 })
  }
}
