import { Asset } from '../entities/Asset'
import { AssetRepository } from '@/infra/mongoose/repositories/AssetRepository'

export class CreateAsset {
  constructor(private repo: AssetRepository) {}

  async execute(data: Asset) {
    return this.repo.create(data)
  }
}
