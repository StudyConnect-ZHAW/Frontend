import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

/**
 * Forwards a GET request to the backend to retrieve a specific group.
 * The group ID is taken from the dynamic route segment `[groupId]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${groupId}`,
  });
}

/**
 * Forwards a PUT request to the backend to update a specific group.
 * The group ID is taken from the dynamic route segment `[groupId]`.
 * The request body is expected to contain the updated group data.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${groupId}`,
    withBody: true,
  });
}

/**
 * Forwards a DELETE request to the backend to delete a specific group.
 * The group ID is taken from the dynamic route segment `[groupId]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${groupId}`,
  });
}