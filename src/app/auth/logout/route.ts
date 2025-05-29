import { NextResponse } from 'next/server';

const TENANT_SUBDOMAIN = process.env.TENANT_SUBDOMAIN!;
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI;

/**
 * Redirects the user to the Microsoft SSO logout page.
 * This function is called when the user clicks the logout button.
 * It clears the access_token cookie and redirects the user to the logout URL 
 * after successfully logging out it redirects to the login page.
 */
export async function GET() {

  // Make sure to set this URL in your Azure AD app registration and it should match the one configured in your app
  const logoutUrl = `https://${TENANT_SUBDOMAIN}.ciamlogin.com` +
    `/${TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout` +
    `?post_logout_redirect_uri=${POST_LOGOUT_REDIRECT_URI}`;

  const response = NextResponse.redirect(logoutUrl);

  // Delete the token cookie
  response.cookies.delete('access_token');

  return response;
}