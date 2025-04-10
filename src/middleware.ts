import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode }from 'jwt-decode';

interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // No token → redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      console.warn('Token expired!');
      return NextResponse.redirect(new URL('/login?error=session_expired', request.url));
    }

    // Token valid
    return NextResponse.next();
  } catch (err) {
    console.error('Invalid token:', err);
    return NextResponse.redirect(new URL('/login?error=invalid_token', request.url));
  }
}

// Apply to these routes:
export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/groups/:path*',
    '/chat/:path*',
    '/calendar/:path*',
    '/settings/:path*',
  ],
};