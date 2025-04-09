import { NextResponse } from 'next/server';

export const TENANT_SUBDOMAIN: string = 'studyconnectpm4';


export async function GET() {
  const logoutUrl = `https://${process.env.TENANT_SUBDOMAIN}.ciamlogin.com/${process.env.TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.POST_LOGOUT_REDIRECT_URI}`;

  return NextResponse.redirect(logoutUrl);
}