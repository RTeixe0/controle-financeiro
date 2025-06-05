import mongoose from 'mongoose'
import { Asset as AssetModel } from '@/models/Asset'
import { Asset } from '@/core/assets/entities/Asset'

export class AssetRepository {
  async create(data: Asset) {
    const userId = new mongoose.Types.ObjectId(data.userId)
    const created = await AssetModel.create({
      ...data,
      userId
    })
    return created
  }

  async findByUser(userId: mongoose.Types.ObjectId) {
    return AssetModel.find({ userId }).sort({ dataAquisicao: -1 })
  }
}
