import { Debt } from '../entities/Debt'
import { DebtRepository } from '@/infra/mongoose/repositories/DebtRepository'

export class CreateDebt {
  constructor(private repo: DebtRepository) {}

  async execute(data: Debt) {
    if (!data.status) {
      data.status = 'ativa'
    }
    return this.repo.create(data)
  }
}
