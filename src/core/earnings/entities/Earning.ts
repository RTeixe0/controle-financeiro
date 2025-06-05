export interface Earning {
  userId: string
  tipo: 'fixo' | 'variavel'
  valorBruto: number
  descontos?: number
  valorLiquido: number
  dataRecebimento: Date
  fonte: string
  observacao?: string
}
