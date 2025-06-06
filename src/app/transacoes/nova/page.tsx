'use client'

import { useState, useEffect } from 'react'
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

interface Categoria {
  _id: string
  nome: string
  tipo: 'receita' | 'despesa'
}

export default function NovaTransacaoPage() {
  const [data, setData] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita')
  const [categoriaId, setCategoriaId] = useState('')
  const [descricao, setDescricao] = useState('')
  const [formaPagamento, setFormaPagamento] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get('/api/categories')
        setCategorias(res.data)
      } catch {
        // ignore errors on category fetch
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!data || !valor || !categoriaId) {
      setError('Preencha os campos obrigatórios')
      return
    }
    setLoading(true)
    try {
      await axios.post('/api/transactions', {
        data,
        valor: Number(valor),
        tipo,
        categoriaId,
        descricao,
        formaPagamento,
        origem: 'manual',
        status: 'realizada',
      })
      setMessage('Transação registrada com sucesso')
      setData('')
      setValor('')
      setCategoriaId('')
      setDescricao('')
      setFormaPagamento('')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao criar transação')
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
          <CardTitle>Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="sm:col-span-1"
            />
            <Input
              type="number"
              placeholder="Valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="sm:col-span-1"
            />
            <Select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as 'receita' | 'despesa')
                setCategoriaId('')
              }}
              className="sm:col-span-1"
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </Select>
            <Select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="sm:col-span-1"
            >
              <option value="">Categoria</option>
              {categorias
                .filter((c) => c.tipo === tipo)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.nome}
                  </option>
                ))}
            </Select>
            <Textarea
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              placeholder="Forma de pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
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

