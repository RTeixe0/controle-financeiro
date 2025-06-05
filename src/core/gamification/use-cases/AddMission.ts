import { GamificationRepository } from '@/infra/mongoose/repositories/GamificationRepository'
import { Missao } from '../entities/Gamification'

export class AddMission {
  constructor(private repo: GamificationRepository) {}

  async execute(userId: string, mission: Missao) {
    return this.repo.addMission(userId, mission)
  }
}
