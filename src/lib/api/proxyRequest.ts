import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/requireAuth';

export interface ProxyOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  backendUrl: string;
  withBody?: boolean;
  validate?: (body: any) => string | null;
}

/**
 * Generic proxy handler for forwarding requests to backend APIs with auth and optional validation.
 */
export async function proxyRequest(req: NextRequest, options: ProxyOptions): Promise<NextResponse> {
  console.debug('[proxyRequest] Requested URL:', req.nextUrl.pathname);
  console.debug('[proxyRequest] Target backend URL:', options.backendUrl);
  console.debug('[proxyRequest] HTTP method:', options.method);
  console.debug('[proxyRequest] withBody:', options.withBody);

  const auth = requireAuth(req);
  if (auth instanceof NextResponse) {
    console.warn('[proxyRequest] Unauthorized request. Aborting.');
    return auth;
  }

  let body: any = null;

  if (options.withBody) {
    try {
      body = await req.json();
      console.debug('[proxyRequest] Parsed request body:', body);
    } catch {
      console.warn('[proxyRequest] Failed to parse JSON body.');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Run provided validation function
    if (options.validate) {
      const err = options.validate(body);
      if (err) {
        console.warn('[proxyRequest] Validation error:', err);
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }
  }

  try {
    console.debug('[proxyRequest] Sending request to backend...');

    console.debug('[proxyRequest] Token:', auth.token);

    const res = await fetch(options.backendUrl, {
      method: options.method,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        ...(options.withBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.withBody ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    console.debug('[proxyRequest] Backend response status:', res.status);
    console.debug('[proxyRequest] Backend response body:', text);

    if (!res.ok) {
      console.warn('[proxyRequest] Backend returned error status:', res.status);
      return NextResponse.json({ error: text }, { status: res.status });
    }

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch {
      console.debug('[proxyRequest] Response is not JSON. Returning raw text.');
      return NextResponse.json({ message: text });
    }
  } catch (err) {
    console.error('[proxyRequest] Proxy request failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
