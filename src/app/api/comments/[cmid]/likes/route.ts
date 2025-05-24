import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/comments`;

export async function PUT(req: NextRequest, { params }: { params: Promise<{ cmid: string }> }) {
  const { cmid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${cmid}/likes`,
  });
}