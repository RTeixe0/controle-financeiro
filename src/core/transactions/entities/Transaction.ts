export interface Transaction {
  userId: string
  data: Date
  valor: number
  tipo: 'receita' | 'despesa'
  categoriaId: string
  descricao?: string
  formaPagamento?: string
  origem: 'manual' | 'importacao' | 'whatsapp'
  anexo?: string
  status?: 'pendente' | 'realizada'
}
