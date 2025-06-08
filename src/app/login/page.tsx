'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function ThemeButton() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initial = stored || 'dark'
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="rounded-md p-2 text-xl transition-colors hover:bg-accent/50"
    >
      🌗
    </button>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email || !senha || (isRegister && !nome)) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const url = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload: any = { email, senha }
      if (isRegister) payload.nome = nome
      const res = await axios.post(url, payload)
      setMessage(res.data.message || 'Sucesso')
      router.push('/dashboard')
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Erro ao processar requisição')
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="fixed right-4 top-4">
        <ThemeButton />
      </div>
      <Card className="w-full max-w-sm sm:max-w-md space-y-4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
          {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <Input
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            )}
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {isRegister ? 'Cadastrar' : 'Entrar'}
            </Button>
          </form>
          <Button
            variant="link"
            type="button"
            className="mt-2 w-full"
            onClick={() => setMode(isRegister ? 'login' : 'register')}
          >
            {isRegister ? 'Já possui conta? Entrar' : 'Não possui conta? Cadastrar'}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
