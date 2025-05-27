import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts`;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pid: string }> }
) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: "GET",
    backendUrl: `${URL}/${pid}`,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ pid: string }> }
) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: "PUT",
    backendUrl: `${URL}/${pid}`,
    withBody: true,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ pid: string }> }
) {
  const { pid } = await params;

  return proxyRequest(req, {
    method: "DELETE",
    backendUrl: `${URL}/${pid}`,
  });
}
