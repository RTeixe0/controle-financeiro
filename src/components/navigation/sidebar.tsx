'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transacoes', label: 'Transações' },
  { href: '/ativos', label: 'Ativos' },
  { href: '/dividas', label: 'Dívidas' },
  { href: '/importar', label: 'Importação' },
]

interface Props {
  pathname?: string
}

export function SidebarLinks({ pathname }: Props) {
  const current = pathname || usePathname()

  return (
    <ul className="space-y-1 p-4">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={cn(
              'block rounded-md px-3 py-2 text-sm hover:bg-accent',
              current.startsWith(link.href) && 'bg-accent font-semibold'
            )}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background transition-colors lg:block dark:bg-background dark:text-foreground">
      <SidebarLinks pathname={pathname} />
    </aside>
  )
}
