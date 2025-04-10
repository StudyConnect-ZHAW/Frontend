import { NextResponse } from 'next/server';

export const TENANT_SUBDOMAIN: string = 'studyconnectpm4';

/**
 * Redirects the user to the Microsoft SSO logout page.
 * Also clears the local access_token cookie.
 */
export async function GET() {
  const logoutUrl = `https://${TENANT_SUBDOMAIN}.ciamlogin.com/${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.POST_LOGOUT_REDIRECT_URI}`;

  const response = NextResponse.redirect(logoutUrl);

  // Remove the cookie before redirect
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}