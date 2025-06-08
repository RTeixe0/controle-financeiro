'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import axios from 'axios'
import { Plus, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'

export default function QuickActions() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const hiddenRoutes = ['/login', '/']
  if (!pathname || hiddenRoutes.includes(pathname)) return null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null
    setFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/api/import/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage(res.data?.message || 'Importação concluída')
      setFile(null)
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
    <TooltipProvider>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full shadow-lg"
              onClick={() => router.push('/transacoes/nova')}
              aria-label="Nova transação"
            >
              <Plus className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">+ Transação</TooltipContent>
        </Tooltip>

        <Dialog open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full shadow-lg"
                  aria-label="Importar CSV"
                >
                  <Upload className="size-5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">Importar CSV</TooltipContent>
          </Tooltip>

          <DialogContent className="space-y-4">
            <DialogHeader>
              <DialogTitle>Importar CSV</DialogTitle>
            </DialogHeader>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}
            <Input type="file" accept=".csv" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
              {loading ? 'Importando...' : 'Enviar'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
