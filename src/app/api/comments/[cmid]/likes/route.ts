import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/comments`;

/**
 * Forwards a PUT request to the backend to toggle the like on a comment.
 * The comment ID is taken from the dynamic route segment `[cmid]`.
 * The user is inferred from the auth token.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ cmid: string }> }) {
  const { cmid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${cmid}/likes`,
  });
}