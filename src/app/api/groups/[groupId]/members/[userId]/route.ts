import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string, userId: string }> }) {
  const { groupId, userId } = await params;

  return proxyRequest(req, {
    method: 'POST',
    backendUrl: `${URL}/${groupId}/members/${userId}`,
    withBody: true,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string, userId: string }> }) {
  const { groupId, userId } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${groupId}/members/${userId}`,
  });
}