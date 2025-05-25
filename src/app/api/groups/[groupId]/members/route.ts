import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

/**
 * Forwards a GET request to the backend to retrieve all members of a specific group.
 * The group ID is taken from the dynamic route segment `[groupId]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${groupId}/members`,
  });
}