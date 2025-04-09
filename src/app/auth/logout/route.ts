import { NextResponse } from 'next/server';

export const TENANT_SUBDOMAIN: string = 'studyconnectpm4';


export async function GET() {
  const logoutUrl = `https://${process.env.TENANT_SUBDOMAIN}.ciamlogin.com/${process.env.TENANT_SUBDOMAIN}.onmicrosoft.com/oauth2/v2.0/logout?post_logout_redirect_uri=http://localhost:3000`;

  return NextResponse.redirect(logoutUrl);
}