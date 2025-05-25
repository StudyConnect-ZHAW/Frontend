import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/users`;

/**
 * Forwards a GET request to the backend to retrieve a specific user.
 * The user ID is taken from the dynamic route segment `[userId]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${userId}`,
  });
}

/**
 * Forwards a PUT request to the backend to update a specific user.
 * The user ID is taken from the dynamic route segment `[userId]`.
 * The request body is expected to contain the full updated user.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${userId}`,
    withBody: true,
  });
}

/**
 * Forwards a DELETE request to the backend to remove a specific user.
 * The user ID is taken from the dynamic route segment `[userId]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${userId}`,
  });
}