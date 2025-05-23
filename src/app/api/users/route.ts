import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/users`;

export async function POST(req: NextRequest) {
  return proxyRequest(req, {
    method: 'POST',
    backendUrl: URL,
    withBody: true,
  });
}

export async function PUT(req: NextRequest) {
  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: URL,
    withBody: true,
  });
}