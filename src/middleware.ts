'use server'

import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const session = await auth()
  console.log('session-middlewerwe:', session)
  const loginURL = new URL('/login', request.url)
  const dashboardURL = new URL('/dashboard/cars', request.url)
  if (session?.user === undefined) {
    if (request.nextUrl.pathname === '/login') {
      return NextResponse.next()
    }
    return NextResponse.redirect(loginURL)
  }
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(dashboardURL)
  }
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
}
