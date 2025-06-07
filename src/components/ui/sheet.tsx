'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

interface SheetContentProps extends Dialog.DialogContentProps {
  side?: 'top' | 'bottom' | 'left' | 'right'
  title: React.ReactNode
  hideTitle?: boolean
}

export function SheetContent({
  side = 'right',
  className,
  children,
  title,
  hideTitle = false,
  ...props
}: SheetContentProps) {
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
        <Dialog.Title>
          {hideTitle ? <VisuallyHidden>{title}</VisuallyHidden> : title}
        </Dialog.Title>
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
