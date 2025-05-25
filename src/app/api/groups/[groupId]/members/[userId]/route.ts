import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

/**
 * Forwards a POST request to the backend to add a user to a specific group.
 * The group ID and user ID are taken from the dynamic route segments `[groupId]` and `[userId]`.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string, userId: string }> }) {
  const { groupId, userId } = await params;

  return proxyRequest(req, {
    method: 'POST',
    backendUrl: `${URL}/${groupId}/members/${userId}`,
    withBody: true, // TODO (Adrian): Does it really need the body?
  });
}

/**
 * Forwards a DELETE request to the backend to remove a user from a specific group.
 * The group ID and user ID are taken from the dynamic route segments `[groupId]` and `[userId]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string, userId: string }> }) {
  const { groupId, userId } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${groupId}/members/${userId}`,
  });
}