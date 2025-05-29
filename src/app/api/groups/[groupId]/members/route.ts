import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

/**
 * Forwards a POST request to the backend to add the current user to a specific group.
 * Note that the backend infers the current user from the token.
 * The group ID is taken from the dynamic route segments `[groupId]`.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'POST',
    backendUrl: `${URL}/${groupId}/members`,
  });
}

/**
 * Forwards a DELETE request to the backend to remove the current user from a specific group.
 * Note that the backend infers the current user from the token.
 * The group ID is taken from the dynamic route segments `[groupId]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${groupId}/members`,
  });
}

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