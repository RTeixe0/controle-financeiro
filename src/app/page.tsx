import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function useNotification() {
  useEffect(() => {
    if (Notification.permission === 'granted') return
    if (Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }, [])

  return () => {
    if (Notification.permission === 'granted') {
      new Notification('Notificações ativadas!')
    } else {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Notificações ativadas!')
        }
      })
    }
  }
}

export default function Home() {
  const enableNotifications = useNotification()
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-4 text-center">
        <CardHeader>
          <CardTitle>Bem-vindo ao Controle Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" type="email" />
          <Button className="w-full">Login</Button>
          <Button variant="outline" className="w-full" onClick={enableNotifications}>
            Ativar notificações
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
