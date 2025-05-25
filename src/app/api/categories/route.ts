import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/categories`;

/**
 * Forwards a POST request to the backend to create a new category.
 */
export async function POST(req: NextRequest) {
  return proxyRequest(req, {
    method: 'POST',
    backendUrl: URL,
    withBody: true,
  });
}

/**
 * Forwards a GET request to the backend to retrieve all categories.
 */
export async function GET(req: NextRequest) {
  return proxyRequest(req, {
    method: 'GET',
    backendUrl: URL,
  });
}