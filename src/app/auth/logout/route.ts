import { NextResponse } from 'next/server';

const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN!;

/**
 * Redirects the user to the Microsoft SSO logout page.
 * This function is called when the user clicks the logout button.
 * It clears the access_token cookie and redirects the user to the logout URL 
 * after successfully logging out it redirects to the login page.
 */
export async function GET() {

  // Make sure to set this URL in your Azure AD app registration and it should match the one configured in your app
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