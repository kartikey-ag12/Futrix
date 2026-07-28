import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from "jose";

// Add protected and public routes
const protectedRoutes = ['/dashboard', '/reports', '/transactions', '/forecasting', '/excel-tools', '/settings'];
const protectedApiRoutes = ["/api/ai", "/api/excel", "/api/export", "/api/xero"];
const authRoutes = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for our auth cookie
  const token = request.cookies.get('futrix_access_token')?.value;
  let isValidToken = false;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_access_secret_for_dev_only");
      await jwtVerify(token, secret);
      isValidToken = true;
    } catch (e) {
      isValidToken = false;
    }
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/api/xero/callback');
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isHomeRoute = pathname === '/';

  // If trying to access a protected route without being authenticated
  if ((isProtectedRoute || isProtectedApiRoute) && !isValidToken) {
    if (isProtectedApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated user tries to access login/signup OR the landing page
  if (isValidToken && (isAuthRoute || isHomeRoute)) {
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - product (product landing pages)
     * - features (features landing pages)
     * - pricing (pricing landing pages)
     */
    '/((?!_next/static|_next/image|favicon.ico|product|features|pricing).*)',
  ],
};
