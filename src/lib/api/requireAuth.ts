import { NextRequest, NextResponse } from "next/server";

/**
 * Extracts the access token from an `HttpOnly` cookie and validates its presence.
 *
 * This function is used in API route handlers to ensure that the incoming request
 * is authenticated. It reads the `access_token` cookie from the request and returns
 * a token string if present. If the token is missing, it returns a 401 Unauthorized
 * `NextResponse` immediately.
 *
 * @param {NextRequest} req - The incoming Next.js request object
 * @returns {{ token: string } | NextResponse} An object containing the token if authenticated,
 * or a `NextResponse` with a 401 status if unauthorized
 *
 * @example
 * const auth = requireAuth(req);
 * if (auth instanceof NextResponse) return auth;
 * const { token } = auth;
 */
export function requireAuth(req: NextRequest): { token: string } | NextResponse {
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return { token };
}