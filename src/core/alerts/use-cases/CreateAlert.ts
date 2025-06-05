import { Alert } from '../entities/Alert'
import { AlertRepository } from '@/infra/mongoose/repositories/AlertRepository'

export class CreateAlert {
  constructor(private repo: AlertRepository) {}

  async execute(data: Alert) {
    if (!data.status) {
      data.status = 'pendente'
    }
    return this.repo.create(data)
  }
}
