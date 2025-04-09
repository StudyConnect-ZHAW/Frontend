import { msalInstance } from '@/lib/msal';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  const redirectUri = process.env.REDIRECT_URI!;

  if (!code) {
    return NextResponse.redirect(new URL('/?error=missing_code', request.url));
  }

  try {
    const tokenResponse = await msalInstance.acquireTokenByCode({
      code,
      redirectUri,
      scopes: ['openid', 'profile'],
    });

    console.log('✅ Token erhalten:', tokenResponse);

    return NextResponse.redirect(new URL('/', request.url));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Fehler beim Token-Abruf:', error.message);
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error.message)}`, request.url));
    }
    console.error('❌ Unbekannter Fehler beim Token-Abruf:', error);
    return NextResponse.redirect(new URL('/?error=unknown_error', request.url));
  }
}