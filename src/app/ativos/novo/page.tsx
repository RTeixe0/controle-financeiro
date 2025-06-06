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
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function NovoAtivoPage() {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('imóvel')
  const [valorAtual, setValorAtual] = useState('')
  const [dataAquisicao, setDataAquisicao] = useState('')
  const [observacao, setObservacao] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!nome || !valorAtual || !dataAquisicao) {
      setError('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/assets', {
        nome,
        tipo,
        valorAtual: Number(valorAtual),
        dataAquisicao,
        observacao,
      })
      setMessage('Ativo registrado com sucesso')
      setNome('')
      setValorAtual('')
      setDataAquisicao('')
      setObservacao('')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao criar ativo')
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-lg space-y-4">
        <CardHeader>
          <CardTitle>Adicionar Ativo</CardTitle>
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
            <Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="sm:col-span-1"
            >
              <option value="imóvel">Imóvel</option>
              <option value="veículo">Veículo</option>
              <option value="investimento">Investimento</option>
              <option value="outro">Outro</option>
            </Select>
            <Input
              type="number"
              placeholder="Valor atual"
              value={valorAtual}
              onChange={(e) => setValorAtual(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="date"
              value={dataAquisicao}
              onChange={(e) => setDataAquisicao(e.target.value)}
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

