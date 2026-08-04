import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from "jose";

// Add protected and public routes
const protectedRoutes = ['/summary', '/performance', '/forecasting', '/reporting', '/chart-of-accounts', '/drivers', '/settings', '/dashboard', '/reports', '/transactions', '/excel-tools'];
const protectedApiRoutes = ["/api/ai", "/api/excel", "/api/export", "/api/xero", "/api/forecasts"];
const protectedAdminRoutes = ['/admin', '/api/admin'];
const authRoutes = ['/login', '/signup'];

const XERO_GATED_ROUTES = ['/summary', '/performance', '/forecasting', '/reporting', '/chart-of-accounts', '/drivers', '/dashboard', '/reports', '/transactions', '/excel-tools'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for our auth cookie
  const token = request.cookies.get('futrix_access_token')?.value;
  let isValidToken = false;
  let userRole = 'USER';
  let newAccessTokenToSet: string | null = null;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_access_secret_for_dev_only");
      const { payload } = await jwtVerify(token, secret);
      isValidToken = true;
      if (payload && payload.role) {
        userRole = payload.role as string;
      }
    } catch (e) {
      isValidToken = false;
    }
  }

  if (!isValidToken) {
    const refreshToken = request.cookies.get('futrix_refresh_token')?.value;
    if (refreshToken) {
      try {
        const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret_for_dev_only");
        const { payload } = await jwtVerify(refreshToken, refreshSecret);
        isValidToken = true;
        if (payload && payload.role) {
          userRole = payload.role as string;
        }
        
        // MINT A NEW ACCESS TOKEN
        const accessSecret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_access_secret_for_dev_only");
        newAccessTokenToSet = await new SignJWT({ userId: payload.userId, email: payload.email, role: payload.role })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("15m")
          .sign(accessSecret);
          
        // INJECT IT INTO THE CURRENT REQUEST SO API ROUTES SEE IT
        request.cookies.set("futrix_access_token", newAccessTokenToSet);
      } catch (e) {
        isValidToken = false;
      }
    }
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/api/xero/callback');
  const isAdminRoute = protectedAdminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If trying to access a protected or admin route without being authenticated
  if ((isProtectedRoute || isProtectedApiRoute || isAdminRoute) && !isValidToken) {
    if (isProtectedApiRoute || (isAdminRoute && pathname.startsWith('/api/'))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Enforce RBAC for Admin Routes
  if (isAdminRoute && isValidToken && userRole !== 'ADMIN') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/summary';
    return NextResponse.redirect(url);
  }

  // Construct response with modified request headers if we refreshed the token
  let response: NextResponse;
  if (newAccessTokenToSet) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', request.cookies.toString());
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    response.cookies.set("futrix_access_token", newAccessTokenToSet, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
  } else {
    response = NextResponse.next();
  }

  return response;
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
