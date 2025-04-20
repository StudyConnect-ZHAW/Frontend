import { msalInstance } from '@/lib/msal';
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface MicrosoftToken {
  oid: string;
  given_name?: string;
  family_name?: string;
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

    const idToken = tokenResponse.idToken!;
    const decoded = jwtDecode<MicrosoftToken>(idToken);

    const { oid: userGuid, given_name: firstName, family_name: lastName, email, upn, preferred_username } = decoded;

    if (!userGuid) {
      console.error('OID not found in ID token');
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url));
    }


    // Check if user has email or username
    const userEmail = email ?? upn ?? preferred_username;

    // Check if user already exists in backend
    const userCheck = await fetch(`${apiUrl}v1/users/${userGuid}`);


    if (userCheck.status === 404) {
      const createUserRes = await fetch(`${apiUrl}v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userGuid,
          firstName : firstName ?? 'Unknown',
          lastName : lastName ?? 'User',
          email: userEmail ?? 'no-email@example.com',
        }),
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
    const response = NextResponse.redirect(new URL('/', request.url));

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