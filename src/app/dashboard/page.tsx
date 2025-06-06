'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface Summary {
  saldoAtual: number
  totalDividas: number
  patrimonioLiquido: number
}

interface Insights {
  receitasDespesasPorMes: { mes: string; receitas: number; despesas: number }[]
  despesasPorCategoria: { categoria: string; total: number }[]
  saldoPorMes: { mes: string; saldo: number }[]
}

const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f87171', '#34d399', '#facc15']

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>()
  const [insights, setInsights] = useState<Insights>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [sRes, iRes] = await Promise.all([
          axios.get('/api/dashboard/summary'),
          axios.get('/api/dashboard/insights'),
        ])
        setSummary(sRes.data)
        setInsights(iRes.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Erro ao buscar dados')
        } else {
          setError('Erro inesperado')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <p className="p-4">Carregando...</p>
  if (error) return <p className="p-4 text-destructive">{error}</p>
  if (!summary || !insights) return null

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
            <Badge variant="outline">Hoje</Badge>
          </CardHeader>
          <CardContent>
            <Label className="text-lg font-semibold">
              {formatCurrency(summary.saldoAtual)}
            </Label>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total em Dívidas</CardTitle>
            <Badge variant="outline">Ativas</Badge>
          </CardHeader>
          <CardContent>
            <Label className="text-lg font-semibold">
              {formatCurrency(summary.totalDividas)}
            </Label>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Patrimônio Líquido</CardTitle>
            <Badge variant="outline">Atual</Badge>
          </CardHeader>
          <CardContent>
            <Label className="text-lg font-semibold">
              {formatCurrency(summary.patrimonioLiquido)}
            </Label>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={insights.receitasDespesasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receitas" fill="#34d399" name="Receitas" />
                <Bar dataKey="despesas" fill="#f87171" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.despesasPorCategoria}
                  dataKey="total"
                  nameKey="categoria"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => entry.categoria}
                >
                  {insights.despesasPorCategoria.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={insights.saldoPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Saldo"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
