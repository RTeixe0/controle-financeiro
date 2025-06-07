'use client'
import { useEffect } from 'react'

export default function SwUpdate() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        alert('Nova versão disponível! Atualizando...')
        window.location.reload()
      })
    }
  }, [])
  return null
}
