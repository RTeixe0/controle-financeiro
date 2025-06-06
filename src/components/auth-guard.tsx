'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
}

export function AuthGuard({ children }: Props) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) setAllowed(true)
        else router.replace('/')
      } catch {
        router.replace('/')
      }
    }
    check()
  }, [router])

  if (!allowed) return null
  return <>{children}</>
}
