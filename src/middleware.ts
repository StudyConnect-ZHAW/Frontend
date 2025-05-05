import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  // Token expiry timestamp (in seconds since Unix epoch)
  exp: number; 
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // No token → redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check if token is expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      console.warn('Token expired:', decoded.exp);
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
    '/preferences/:path*',
    '/groups/:path*',
    '/chat/:path*',
    '/calendar/:path*',
    '/forum/:path*',
  ],
};