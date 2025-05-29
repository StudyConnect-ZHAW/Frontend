import { msalInstance } from '@/lib/msal';
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface MicrosoftToken {
  oid: string;
  name?: string;
  email?: string;
  upn?: string;
  preferred_username?: string;
}

/**
 * Redirects the user to the home page after acquiring an access token.
 * This function is called when the user is redirected back from Microsoft SSO.
 * It exchanges the authorization code for tokens, checks if the user already exists in the backend,
 * creates the user if necessary, and sets an HttpOnly cookie with the access token.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  const redirectUri = process.env.REDIRECT_URI!;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await msalInstance.acquireTokenByCode({
      code,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
    });

    const idToken = tokenResponse.idToken;
    const accessToken = tokenResponse.accessToken;

    if (!idToken) {
      console.error('ID token is missing from the token response');

      return NextResponse.redirect(new URL('/?error=missing_id_token', request.url));
    }

    const decoded = jwtDecode<MicrosoftToken>(idToken);
    const oid = decoded.oid;

    if (!oid) {
      console.error('OID not found in ID token');

      return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
    }

    // Check if user already exists in backend
    const userCheck = await fetch(`${apiUrl}v1/users/${oid}`);

    if (userCheck.status === 404) {
      console.log("User doesn't exist. Creating a new user...");

      const createUserRes = await fetch(`${apiUrl}v2/users`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!createUserRes.ok) {
        return NextResponse.redirect(
          new URL(`/?error=creation_failed_${createUserRes.status}`, request.url)
        );
      }

    } else if (!userCheck.ok) {
      console.error(`User check failed: ${userCheck.status}`);

      return NextResponse.redirect(new URL('/?error=user_check_failed', request.url));
    }

    // Create redirect response
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
    const response = NextResponse.redirect(`${baseUrl}/`);

    // Set HttpOnly cookie on response
    response.cookies.set('access_token', tokenResponse.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
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