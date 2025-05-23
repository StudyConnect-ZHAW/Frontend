import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxyRequest';

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/categories`;

export async function GET(req: NextRequest, context: { params: { cid: string } }) {
  const { cid } = await context.params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${cid}`,
  });
}

export async function DELETE(req: NextRequest, context: { params: { cid: string } }) {
  const { cid } = await context.params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${cid}`,
  });
}
