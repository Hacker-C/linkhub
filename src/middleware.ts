import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/actions/auth/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isStaticAssetOrApi =
    pathname.startsWith('/_next')
    || pathname.startsWith('/api')
    || pathname.includes('.')

  if (isStaticAssetOrApi) {
    return NextResponse.next()
  }

  // Create a Supabase client for authentication check
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  const url = request.nextUrl.clone()
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      url.pathname = `/login`
      return NextResponse.redirect(url)
    } else {
      if (pathname === '/admin') {
        url.pathname = `/admin/0`
        return NextResponse.redirect(url)
      }
    }
  } else if (pathname.startsWith('/login') || pathname.startsWith('/sign-up')) {
    if (isAuthenticated) {
      url.pathname = `/admin`
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

  export const config = {
  // Use a broad matcher - the function above handles filtering
  matcher: [
    // Match everything except _next/static, _next/image, and favicon.ico
    // We rely on the function's internal filter for other exclusions like '.' or '/api'
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}