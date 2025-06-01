import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts`;

/**
 * Forwards a PUT request to the backend to toggle the like on a post.
 * The postId is taken from the dynamic route segment `[pid]`.
 * The user is inferred from the auth token.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${pid}/likes`,
  });
}