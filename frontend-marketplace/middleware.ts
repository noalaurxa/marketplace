import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Route access matrix
// CUSTOMER: "/", "/products/[id]"
// ADMIN:    "/", "/products/[id]", "/admin"
// Unauthenticated: only "/login" and "/register"

const PUBLIC_ROUTES = ['/login', '/register'];
const ADMIN_ROUTES = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes always
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header (stored in cookie "token")
  const token = request.cookies.get('token')?.value;

  // No token → redirect to login
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Decode token payload (simple base64 decode — no secret needed in edge)
  let role: string | null = null;
  try {
    let payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    while (payloadBase64.length % 4) {
      payloadBase64 += '=';
    }
    const decoded = JSON.parse(atob(payloadBase64));
    role = decoded.role ?? null;

    // Check token expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete('token');
      return res;
    }
  } catch {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // ADMIN-only routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (role !== 'ADMIN') {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
