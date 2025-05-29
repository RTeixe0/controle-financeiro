import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ message: 'Logout realizado' })

  res.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0) // ← limpa o cookie corretamente
  })

  return res
}
