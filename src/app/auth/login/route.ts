// /app/api/auth/signin/route.ts
import { NextResponse } from 'next/server';
import { msalInstance } from '@/lib/msal';

export async function GET() {

  const redirectUri = process.env.REDIRECT_URI!;

  const authCodeUrl = await msalInstance.getAuthCodeUrl({
    scopes: ['openid', 'profile'],
    redirectUri,
    responseMode: 'query',
  });

  return NextResponse.redirect(authCodeUrl);
}