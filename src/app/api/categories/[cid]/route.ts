import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/categories`;

/**
 * Forwards a GET request to the backend to retrieve a specific category by ID.
 * The ID is extracted from the dynamic route segment `[cid]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${cid}`,
  });
}

/**
 * Forwards a DELETE request to the backend to delete a specific category by ID.
 * The ID is extracted from the dynamic route segment `[cid]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cid: string }> }) {
  const { cid } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${cid}`,
  });
}