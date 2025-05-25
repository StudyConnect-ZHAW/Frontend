import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/groups`;

/**
 * Forwards a POST request to the backend to create a new group.
 * The request body is expected to contain all the necessary group information.
 */
export async function POST(req: NextRequest) {
  return proxyRequest(req, {
    method: 'POST',
    backendUrl: URL,
    withBody: true,
  });
}

/**
 * Forwards a GET request to the backend to retrieve all groups.
 */
export async function GET(req: NextRequest) {
  return proxyRequest(req, {
    method: 'GET',
    backendUrl: URL,
  });
}