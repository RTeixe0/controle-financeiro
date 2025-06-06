'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Alert {
  _id: string
  tipo: string
  mensagem: string
  dataAlvo: string
  status: 'pendente' | 'lido'
}

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const [novoTipo, setNovoTipo] = useState('')
  const [novaMensagem, setNovaMensagem] = useState('')
  const [novaData, setNovaData] = useState('')

  async function carregar() {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('/api/alerts')
      setAlertas(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao buscar alertas')
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function marcarComoLido(id: string) {
    try {
      const res = await axios.put(`/api/alerts/${id}`, { status: 'lido' })
      setAlertas((prev) => prev.map((a) => (a._id === id ? res.data : a)))
    } catch {
      // ignore
    }
  }

  async function deletar(id: string) {
    try {
      await axios.delete(`/api/alerts/${id}`)
      setAlertas((prev) => prev.filter((a) => a._id !== id))
    } catch {
      // ignore
    }
  }

  async function criarAlerta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const res = await axios.post('/api/alerts', {
        tipo: novoTipo,
        mensagem: novaMensagem,
        dataAlvo: new Date(novaData),
      })
      setAlertas((prev) => [...prev, res.data])
      setNovoTipo('')
      setNovaMensagem('')
      setNovaData('')
      setOpen(false)
    } catch {
      // ignore
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Card className="space-y-4">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Alertas</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Novo Alerta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Alerta</DialogTitle>
              </DialogHeader>
              <form onSubmit={criarAlerta} className="space-y-3">
                <div>
                  <Label>Tipo</Label>
                  <Input value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} />
                </div>
                <div>
                  <Label>Mensagem</Label>
                  <Input value={novaMensagem} onChange={(e) => setNovaMensagem(e.target.value)} />
                </div>
                <div>
                  <Label>Data Alvo</Label>
                  <Input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.map((alerta) => (
                  <TableRow key={alerta._id} className={alerta.status === 'pendente' ? '' : 'opacity-60'}>
                    <TableCell>{alerta.tipo}</TableCell>
                    <TableCell>{alerta.mensagem}</TableCell>
                    <TableCell>{new Date(alerta.dataAlvo).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={alerta.status === 'pendente' ? 'default' : 'outline'}>
                        {alerta.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {alerta.status === 'pendente' && (
                        <Button size="sm" variant="outline" onClick={() => marcarComoLido(alerta._id)}>
                          Marcar lido
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => deletar(alerta._id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

