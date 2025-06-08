import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/users/me`;

/**
 * Forwards a GET request to the backend to retrieve the current user's information.
 */
export async function GET(req: NextRequest) {
  return proxyRequest(req, {
    method: 'GET',
    backendUrl: URL,
  });
}