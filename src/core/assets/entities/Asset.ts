export interface ValorHistorico {
  data: Date
  valor: number
}

export interface Asset {
  userId: string
  nome: string
  tipo: 'imóvel' | 'veículo' | 'investimento' | 'outro'
  valorAtual: number
  dataAquisicao: Date
  historicoDeValores: ValorHistorico[]
  observacao?: string
}
