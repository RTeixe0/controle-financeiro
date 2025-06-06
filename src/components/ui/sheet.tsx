'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

interface SheetContentProps extends Dialog.DialogContentProps {
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export function SheetContent({ side = 'right', className, children, ...props }: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content
        {...props}
        className={cn(
          'fixed z-50 bg-background shadow-lg transition-transform data-[state=open]:animate-in data-[state=closed]:animate-out',
          side === 'left' && 'inset-y-0 left-0 h-full w-64 data-[state=closed]:-translate-x-full',
          side === 'right' && 'inset-y-0 right-0 h-full w-64 data-[state=closed]:translate-x-full',
          side === 'top' && 'inset-x-0 top-0 w-full data-[state=closed]:-translate-y-full',
          side === 'bottom' && 'inset-x-0 bottom-0 w-full data-[state=closed]:translate-y-full',
          className,
        )}
      >
        {children}
        <SheetClose asChild>
          <button className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100">
            <X className="size-4" />
          </button>
        </SheetClose>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
