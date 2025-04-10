import { msalInstance } from '@/lib/msal';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Redirects the user to the home page after acquiring an access token.
 * This function is called when the user is redirected back from Microsoft SSO.
 * It exchanges the authorization code for tokens and sets an HttpOnly cookie with the access token.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  const redirectUri = process.env.REDIRECT_URI!;

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await msalInstance.acquireTokenByCode({
      code,
      redirectUri,
      scopes: ['openid', 'profile'],
    });

    console.log('Token successfully retrieved:', tokenResponse.accessToken);

    // Create redirect response
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set HttpOnly cookie on response
    response.cookies.set('access_token', tokenResponse.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error acquiring token:', error.message);
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, request.url));
    }

    console.error('Unknown error acquiring token:', error);
    return NextResponse.redirect(new URL('/?error=unknown_error', request.url));
  }
}