import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts`;

/**
 * Adds or removes a like from a specified post. The user giving or removing the like is 
 * inferred from the token.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${pid}/likes`,
  });
}