export interface Missao {
  nome: string
  descricao: string
  status: 'ativa' | 'concluida'
  dataInicio: Date
  dataFim?: Date
  recompensa?: string
}

export interface Conquista {
  nome: string
  descricao: string
  dataConquista: Date
}

export interface Gamification {
  userId: string
  missoes: Missao[]
  conquistas: Conquista[]
}
