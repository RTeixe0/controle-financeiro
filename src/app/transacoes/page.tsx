"use client"

import { useEffect, useState } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface Categoria {
  _id: string
  nome: string
  tipo: "receita" | "despesa"
}

export default function Page() {
  const [valor, setValor] = useState("")
  const [data, setData] = useState("")
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa")
  const [categoriaId, setCategoriaId] = useState("")
  const [descricao, setDescricao] = useState("")
  const [formaPagamento, setFormaPagamento] = useState("")

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("/api/categories")
        setCategorias(res.data)
      } catch {
        // ignore erro ao carregar categorias
      }
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!valor || !data || !categoriaId) {
      setError("Preencha os campos obrigatórios")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/transactions", {
        valor: parseFloat(valor),
        data: new Date(data),
        tipo,
        categoriaId,
        descricao,
        formaPagamento,
        origem: "manual",
      })
      setMessage("Transação lançada com sucesso")
      setValor("")
      setData("")
      setCategoriaId("")
      setDescricao("")
      setFormaPagamento("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erro ao lançar transação")
      } else {
        setError("Erro inesperado")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <Card className="mx-auto w-full max-w-md sm:max-w-lg">
        <CardHeader>
          <CardTitle>Lançar Transação</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onValueChange={(value) => setTipo(value as 'receita' | 'despesa')}
              >
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </Select>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select
                value={categoriaId}
                onValueChange={setCategoriaId}
              >
                <option value="">Selecione...</option>
                {categorias
                  .filter((c) => c.tipo === tipo)
                  .map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nome}
                    </option>
                  ))}
              </Select>
            </div>
            <Input
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <Input
              placeholder="Forma de pagamento"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Lançar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
