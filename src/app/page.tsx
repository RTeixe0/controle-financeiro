import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="text-center space-y-4">
        <h1 className="text-xl font-semibold">Bem-vindo ao Controle Financeiro</h1>
        <Button>Login</Button>
      </Card>
    </main>
  )
}
