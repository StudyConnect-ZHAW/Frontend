import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

export async function GET(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${groupId}/members`,
  });
}