export interface Debt {
  userId: string
  nome: string
  valorOriginal: number
  valorAtual: number
  juros?: number
  dataContratacao: Date
  parcelasTotais: number
  parcelasPagas: number
  dataVencimentoProxima: Date
  status?: 'ativa' | 'quitada' | 'renegociando'
  observacao?: string
}
