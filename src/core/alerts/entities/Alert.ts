export interface Alert {
  userId: string
  tipo: string
  dataAlvo: Date
  mensagem: string
  status?: 'pendente' | 'lido'
}
