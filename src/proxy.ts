import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add protected and public routes
const protectedRoutes = ['/dashboard', '/reports', '/transactions', '/forecasting', '/excel-tools', '/settings'];
const authRoutes = ['/login', '/signup'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for our auth cookie
  const hasToken = request.cookies.has('futrix_auth_token');

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isHomeRoute = pathname === '/';

  // If trying to access a protected route without being authenticated
  if (isProtectedRoute && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated user tries to access login/signup OR the landing page
  if (hasToken && (isAuthRoute || isHomeRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - product (product landing pages)
     * - features (features landing pages)
     * - pricing (pricing landing pages)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|product|features|pricing).*)',
  ],
};
