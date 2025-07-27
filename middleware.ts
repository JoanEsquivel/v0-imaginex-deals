import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware ensures that the app works properly with client-side authentication
// by redirecting all requests to the app itself and letting the client handle routing
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
