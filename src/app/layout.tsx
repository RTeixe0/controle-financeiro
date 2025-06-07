import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { Navbar } from '@/components/navigation/navbar'
import { Sidebar } from '@/components/navigation/sidebar'
import SwUpdate from '@/components/sw-update'
import QuickActions from '@/components/quick-actions'
import Providers from '@/components/providers'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Gerencie suas finanças de forma simples",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-background text-foreground antialiased transition-colors dark:bg-background dark:text-foreground`}
      >
        <Providers>
          <Navbar />
          <Sidebar />
          <SwUpdate />
          <main className="container mx-auto pt-14 lg:ml-64">{children}</main>
          <QuickActions />
        </Providers>
      </body>
    </html>
  );
}
