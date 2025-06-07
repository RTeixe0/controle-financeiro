'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'
import { CheckCircle2, Info } from 'lucide-react'

interface Mission {
  _id: string
  nome: string
  descricao: string
  progresso: number
  dataInicio: string
  dataFim: string
  recompensa: string
  icon?: string
}

interface Achievement {
  _id: string
  nome: string
  descricao: string
  dataConquista: string
  icon?: string
}

export default function GamificacaoPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [mRes, aRes] = await Promise.all([
          axios.get('/api/gamification/missions'),
          axios.get('/api/gamification/achievements'),
        ])
        setMissions(mRes.data)
        setAchievements(aRes.data)
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

  return (
    <div className="space-y-6 p-4">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Missões</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <Card key={mission._id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {mission.icon && (
                    <img src={mission.icon} alt="" className="size-5" />
                  )}
                  {mission.nome}
                </CardTitle>
                <CardDescription>{mission.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={mission.progresso} />
                <div className="text-sm text-muted-foreground">
                  {mission.dataInicio && (
                    <p>Início: {new Date(mission.dataInicio).toLocaleDateString()}</p>
                  )}
                  {mission.dataFim && (
                    <p>Fim: {new Date(mission.dataFim).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Badge variant="outline">Recompensa: {mission.recompensa}</Badge>
                <TooltipProvider>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <Info className="size-4 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>{mission.progresso}% concluído</TooltipContent>
                  </TooltipRoot>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Conquistas</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <Card key={ach._id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {ach.icon && (
                    <img src={ach.icon} alt="" className="size-5" />
                  )}
                  {ach.nome}
                </CardTitle>
                <CardDescription>{ach.descricao}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Conquistado em{' '}
                  {new Date(ach.dataConquista).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
            <CheckCircle2 className="size-5" />
            Ajuda
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gamificação</DialogTitle>
            <DialogDescription>
              Complete missões para ganhar recompensas e desbloquear conquistas!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
