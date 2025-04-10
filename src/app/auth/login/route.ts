import { NextResponse } from 'next/server';
import { msalInstance } from '@/lib/msal';

/**
 * Redirects the user to the Microsoft SSO login page.
 * This function is called when the user clicks the login button.
 * It generates an authorization code URL and redirects the user to it.
 */
export async function GET() {
  const redirectUri = process.env.REDIRECT_URI!;

  const authCodeUrl = await msalInstance.getAuthCodeUrl({
    scopes: ['openid', 'profile'],
    redirectUri,
    responseMode: 'query',
  });

  return NextResponse.redirect(authCodeUrl);
}