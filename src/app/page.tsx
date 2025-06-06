import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-4 text-center">
        <CardHeader>
          <CardTitle>Bem-vindo ao Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" type="email" />
          <Button className="w-full">Login</Button>
        </CardContent>
      </Card>
    </main>
  )
}
