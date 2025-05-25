import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/comments`;

/**
 * Forwards a GET request to the backend to retrieve a specific comment.
 * The comment ID is taken from the dynamic route segment `[cmid]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ cmid: string }> }) {
  const { cmid } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${cmid}`,
  });
}

/**
 * Forwards a PUT request to the backend to update a specific comment.
 * The comment ID is taken from the dynamic route segment `[cmid]`.
 * The request body is expected to contain the full updated comment.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ cmid: string }> }) {
  const { cmid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${cmid}`,
    withBody: true,
  });
}

/**
 * Forwards a DELETE request to the backend to delete a specific comment.
 * The comment ID is taken from the dynamic route segment `[cmid]`.
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cmid: string }> }) {
  const { cmid } = await params;

  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${cmid}`,
  });
}