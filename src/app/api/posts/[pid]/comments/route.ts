import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts`;

/**
 * Forwards a POST request to the backend to create a new comment on a specific post.
 * The post ID is taken from the dynamic route segment `[pid]`.
 * The request body is expected to contain the comment information.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: 'POST',
    backendUrl: `${URL}/${pid}/comments`,
    withBody: true,
  });
}

/**
 * Forwards a GET request to the backend to retrieve all comments for a specific post.
 * The post ID is taken from the dynamic route segment `[pid]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${pid}/comments`,
  });
}