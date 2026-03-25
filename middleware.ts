import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // With anonymous sessions, we don't need to protect routes
  // Users can access the app immediately without authentication
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
