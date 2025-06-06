'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { SidebarLinks } from './sidebar'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transacoes', label: 'Transações' },
  { href: '/ativos', label: 'Ativos' },
  { href: '/dividas', label: 'Dívidas' },
  { href: '/importar', label: 'Importação' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b bg-background px-4 lg:ml-64">
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="lg:hidden p-0">
          <SidebarLinks pathname={pathname} />
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="ml-2 font-semibold">
        Controle Financeiro
      </Link>
      <nav className="ml-auto hidden gap-4 lg:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'text-sm transition-colors hover:text-primary',
              pathname.startsWith(link.href) && 'font-semibold text-primary'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
