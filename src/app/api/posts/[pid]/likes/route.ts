import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${pid}/likes`,
  });
}