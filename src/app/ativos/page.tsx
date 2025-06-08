"use client"

import { useState } from "react"
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

export default function Page() {
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState<"imóvel" | "veículo" | "investimento" | "outro">("outro")
  const [valorAtual, setValorAtual] = useState("")
  const [dataAquisicao, setDataAquisicao] = useState("")
  const [observacao, setObservacao] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!nome || !valorAtual || !dataAquisicao) {
      setError("Preencha os campos obrigatórios")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/assets", {
        nome,
        tipo,
        valorAtual: parseFloat(valorAtual),
        dataAquisicao: new Date(dataAquisicao),
        historicoDeValores: [],
        observacao,
      })
      setMessage("Ativo cadastrado com sucesso")
      setNome("")
      setValorAtual("")
      setDataAquisicao("")
      setObservacao("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erro ao cadastrar ativo")
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
          <CardTitle>Lançar Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <div>
              <Label>Tipo</Label>
              <Select
                value={tipo}
                onChange={(e) =>
                  setTipo(
                    e.target.value as 'imóvel' | 'veículo' | 'investimento' | 'outro'
                  )
                }
                className="mt-1"
              >
                <option value="imóvel">Imóvel</option>
                <option value="veículo">Veículo</option>
                <option value="investimento">Investimento</option>
                <option value="outro">Outro</option>
              </Select>
            </div>
            <div>
              <Label>Valor Atual</Label>
              <Input
                type="number"
                value={valorAtual}
                onChange={(e) => setValorAtual(e.target.value)}
              />
            </div>
            <div>
              <Label>Data de Aquisição</Label>
              <Input
                type="date"
                value={dataAquisicao}
                onChange={(e) => setDataAquisicao(e.target.value)}
              />
            </div>
            <Input
              placeholder="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Salvar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
