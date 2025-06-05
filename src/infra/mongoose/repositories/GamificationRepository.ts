import mongoose from 'mongoose'
import { Gamification as GamificationModel } from '@/models/Gamification'
import { Missao } from '@/core/gamification/entities/Gamification'

export class GamificationRepository {
  async getMissions(userId: mongoose.Types.ObjectId) {
    const gamificacoes = await GamificationModel.find({ userId })
    return gamificacoes.map(g => g.missoes).flat()
  }

  async getArchievements(userId: mongoose.Types.ObjectId) {
    const gamificacao = await GamificationModel.findOne({ userId })
    return gamificacao ? gamificacao.conquistas : []
  }

  async addMission(userId: string, mission: Missao) {
    const objId = new mongoose.Types.ObjectId(userId)
    let registro = await GamificationModel.findOne({ userId: objId })
    if (!registro) {
      registro = await GamificationModel.create({ userId: objId, missoes: [mission], conquistas: [] })
    } else {
      registro.missoes.push(mission)
      await registro.save()
    }
    return registro.missoes[registro.missoes.length - 1]
  }
}
