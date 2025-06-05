import { Transaction } from '../entities/Transaction'
import { TransactionRepository } from '@/infra/mongoose/repositories/TransactionRepository'

export class CreateTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(data: Transaction) {
    if (!data.status) {
      data.status = 'realizada'
    }
    return this.repo.create(data)
  }
}
