import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${groupId}`,
  })
}

export async function PUT(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${groupId}`,
    withBody: true,
  })
}

export async function DELETE(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${groupId}`,
  })
}