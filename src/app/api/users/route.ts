import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL_V1 = `${process.env.NEXT_PUBLIC_API_URL}v1/users`;
/** New endpoint to create a new user using solely the token. */
const URL_V2 = `${process.env.NEXT_PUBLIC_API_URL}v2/users`;

/**
 * Forwards a POST request to the backend to create a new user.
 * The data will be inferred from the token in the backend.
 * This route is used to create and store a new user in the backend after
 * logging in using the authentication service for the first time.
 */
export async function POST(req: NextRequest) {
  return proxyRequest(req, {
    method: 'POST',
    backendUrl: URL_V2,
  });
}

/**
 * Forwards a PUT request to the backend to update the current user's profile.
 * The user is identified via the authentication token.
 * The request body is expected to contain the updated profile data.
 */
export async function PUT(req: NextRequest) {
  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: URL_V1,
    withBody: true,
  });
}