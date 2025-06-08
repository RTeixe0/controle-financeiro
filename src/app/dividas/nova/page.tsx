'use client'

import { useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function NovaDividaPage() {
  const [nome, setNome] = useState('')
  const [valorOriginal, setValorOriginal] = useState('')
  const [juros, setJuros] = useState('')
  const [parcelas, setParcelas] = useState('')
  const [dataContratacao, setDataContratacao] = useState('')
  const [vencimento, setVencimento] = useState('')
  const [observacao, setObservacao] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!nome || !valorOriginal || !parcelas || !dataContratacao || !vencimento) {
      setError('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/debts', {
        nome,
        valorOriginal: Number(valorOriginal),
        valorAtual: Number(valorOriginal),
        juros: juros ? Number(juros) : undefined,
        parcelasTotais: Number(parcelas),
        parcelasPagas: 0,
        dataContratacao,
        dataVencimentoProxima: vencimento,
        observacao,
      })
      setMessage('Dívida registrada com sucesso')
      setNome('')
      setValorOriginal('')
      setJuros('')
      setParcelas('')
      setDataContratacao('')
      setVencimento('')
      setObservacao('')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao criar dívida')
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl space-y-4">
        <CardHeader>
          <CardTitle>Registrar Dívida</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              type="number"
              placeholder="Valor original"
              value={valorOriginal}
              onChange={(e) => setValorOriginal(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="number"
              placeholder="Juros (%)"
              value={juros}
              onChange={(e) => setJuros(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="number"
              placeholder="Parcelas"
              value={parcelas}
              onChange={(e) => setParcelas(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="date"
              value={dataContratacao}
              onChange={(e) => setDataContratacao(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              className="sm:col-span-1"
            />
            <Textarea
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="sm:col-span-2"
            />
            <Button type="submit" className="sm:col-span-2" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

