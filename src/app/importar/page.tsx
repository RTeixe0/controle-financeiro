'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Papa from 'papaparse'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface Row {
  data: string
  valor: string
  tipo: 'receita' | 'despesa'
  categoria: string
  descricao?: string
  formaPagamento?: string
}

export default function Page() {
  const router = useRouter()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ count: number; categoriesCreated: number } | null>(null)
  const [showJson, setShowJson] = useState(false)
  const [jsonInput, setJsonInput] = useState('')

  function parseCsv(text: string) {
    const parsed = Papa.parse<any>(text, { header: true, skipEmptyLines: true })
    const data: Row[] = (parsed.data || []).map((r: any) => ({
      data: r.data || '',
      valor: r.valor || '',
      tipo: (r.tipo || 'despesa') as 'receita' | 'despesa',
      categoria: r.categoria || '',
      descricao: r.descricao || '',
      formaPagamento: r.formaPagamento || ''
    }))
    setRows(data)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    parseCsv(text)
  }

  function handleRowChange(index: number, field: keyof Row, value: string) {
    setRows(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value } as Row
      return updated
    })
  }

  function loadJson() {
    try {
      const arr = JSON.parse(jsonInput)
      if (Array.isArray(arr)) {
        const data: Row[] = arr.map((t: any) => ({
          data: t.data || '',
          valor: String(t.valor ?? ''),
          tipo: (t.tipo || 'despesa') as 'receita' | 'despesa',
          categoria: t.categoria || '',
          descricao: t.descricao || '',
          formaPagamento: t.formaPagamento || ''
        }))
        setRows(data)
        setShowJson(false)
        setJsonInput('')
      } else {
        setError('JSON inválido')
      }
    } catch {
      setError('JSON inválido')
    }
  }

  function validate(): boolean {
    for (const r of rows) {
      if (!r.data || !r.valor || !r.tipo || !r.categoria) {
        setError('Preencha data, valor, tipo e categoria de todas as linhas')
        return false
      }
    }
    return true
  }

  async function handleImport() {
    if (!validate()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const payload = rows.map(r => ({
        ...r,
        valor: Number(r.valor)
      }))
      const res = await axios.post('/api/import/csv', payload)
      setResult(res.data)
      setRows([])
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao importar')
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="mx-auto w-full max-w-3xl sm:max-w-4xl space-y-4">
        <CardHeader>
          <CardTitle>Importar Transações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-destructive text-destructive">
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result && (
            <Alert className="border-green-600 text-green-600">
              <AlertTitle>Importação concluída</AlertTitle>
              <AlertDescription>
                {`Foram importadas ${result.count} transações e criadas ${result.categoriesCreated} categorias.`}
                <Button
                  variant="link"
                  className="ml-2 px-0"
                  onClick={() => router.push('/transacoes')}
                >
                  Ver transações
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <Button variant="ghost" type="button" onClick={() => setShowJson(v => !v)}>
            {showJson ? 'Fechar JSON' : 'Colar JSON'}
          </Button>
          {showJson && (
            <div className="space-y-2">
              <Textarea
                value={jsonInput}
                onChange={e => setJsonInput(e.target.value)}
                placeholder="Cole o JSON aqui"
              />
              <Button type="button" onClick={loadJson} size="sm">
                Carregar JSON
              </Button>
            </div>
          )}
          {rows.length > 0 && (
            <div className="space-y-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Forma Pgto.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.data}
                          onChange={e => handleRowChange(i, 'data', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.valor}
                          onChange={e => handleRowChange(i, 'valor', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                      <Select
                        value={row.tipo}
                        onChange={e => handleRowChange(i, 'tipo', e.target.value)}
                        className="h-9"
                      >
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                      </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.categoria}
                          onChange={e => handleRowChange(i, 'categoria', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.descricao || ''}
                          onChange={e => handleRowChange(i, 'descricao', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.formaPagamento || ''}
                          onChange={e => handleRowChange(i, 'formaPagamento', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button type="button" onClick={handleImport} disabled={loading} className="w-full">
                {loading ? 'Importando...' : 'Confirmar Importação'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
