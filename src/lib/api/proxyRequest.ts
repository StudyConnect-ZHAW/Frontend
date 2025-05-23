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
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let body: any = null;
  if (options.withBody) {
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Run provided validation function
    if (options.validate) {
      const err = options.validate(body);
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }
  }

  try {
    const res = await fetch(options.backendUrl, {
      method: options.method,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        ...(options.withBody ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.withBody ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: text }, { status: res.status });
    }

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ message: text });
    }
  } catch (err) {
    console.error('Proxy request failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
