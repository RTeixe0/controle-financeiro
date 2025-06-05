import { Earning } from '../entities/Earning'
import { EarningRepository } from '@/infra/mongoose/repositories/EarningRepository'

export class CreateEarning {
  constructor(private repo: EarningRepository) {}

  async execute(data: Earning) {
    return this.repo.create(data)
  }
}
