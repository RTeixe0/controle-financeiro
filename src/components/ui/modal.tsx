import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose(): void
  children: ReactNode
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md">
        {children}
        <button className="mt-4 text-sm underline" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  )
}
