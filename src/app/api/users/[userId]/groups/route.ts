import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/users`;

/**
 * Forwards a GET request to the backend to retrieve all groups a specific user is a member of.
 * The user ID is taken from the dynamic route segment `[userId]`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${userId}/groups`,
  });
}