import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/users`;

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = await context.params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${userId}`,
  });
}

export async function PUT(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = await context.params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${userId}`,
    withBody: true,
  });
}

export async function DELETE(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = await context.params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${userId}`,
  });
}