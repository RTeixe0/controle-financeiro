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

export default function Page() {
  const [nome, setNome] = useState("")
  const [valorOriginal, setValorOriginal] = useState("")
  const [valorAtual, setValorAtual] = useState("")
  const [juros, setJuros] = useState("")
  const [dataContratacao, setDataContratacao] = useState("")
  const [parcelasTotais, setParcelasTotais] = useState("")
  const [parcelasPagas, setParcelasPagas] = useState("")
  const [dataVencimentoProxima, setDataVencimentoProxima] = useState("")
  const [observacao, setObservacao] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!nome || !valorOriginal || !valorAtual || !dataContratacao) {
      setError("Preencha os campos obrigatórios")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/debts", {
        nome,
        valorOriginal: parseFloat(valorOriginal),
        valorAtual: parseFloat(valorAtual),
        juros: juros ? parseFloat(juros) : undefined,
        dataContratacao: new Date(dataContratacao),
        parcelasTotais: Number(parcelasTotais || 0),
        parcelasPagas: Number(parcelasPagas || 0),
        dataVencimentoProxima: dataVencimentoProxima
          ? new Date(dataVencimentoProxima)
          : undefined,
        observacao,
        status: "ativa",
      })
      setMessage("Dívida cadastrada com sucesso")
      setNome("")
      setValorOriginal("")
      setValorAtual("")
      setJuros("")
      setDataContratacao("")
      setParcelasTotais("")
      setParcelasPagas("")
      setDataVencimentoProxima("")
      setObservacao("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Erro ao cadastrar dívida")
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
          <CardTitle>Lançar Dívida</CardTitle>
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
              <Label>Valor Original</Label>
              <Input
                type="number"
                value={valorOriginal}
                onChange={(e) => setValorOriginal(e.target.value)}
              />
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
              <Label>Juros (%)</Label>
              <Input
                type="number"
                value={juros}
                onChange={(e) => setJuros(e.target.value)}
              />
            </div>
            <div>
              <Label>Data de Contratação</Label>
              <Input
                type="date"
                value={dataContratacao}
                onChange={(e) => setDataContratacao(e.target.value)}
              />
            </div>
            <Input
              placeholder="Parcelas Totais"
              type="number"
              value={parcelasTotais}
              onChange={(e) => setParcelasTotais(e.target.value)}
            />
            <Input
              placeholder="Parcelas Pagas"
              type="number"
              value={parcelasPagas}
              onChange={(e) => setParcelasPagas(e.target.value)}
            />
            <div>
              <Label>Próximo Vencimento</Label>
              <Input
                type="date"
                value={dataVencimentoProxima}
                onChange={(e) => setDataVencimentoProxima(e.target.value)}
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
