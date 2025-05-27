import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts/search`;

export async function GET(req: NextRequest) {
  return proxyRequest(req, {
    method: "GET",
    backendUrl: URL,
  });
}