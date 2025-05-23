import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/posts`;

export async function POST(req: NextRequest, { params }: { params: { pid: string } }) {
  return proxyRequest(req, {
    method: 'POST',
    backendUrl: `${URL}/${params.pid}/comments`,
    withBody: true,
  });
}

export async function GET(req: NextRequest, { params }: { params: { pid: string } }) {
  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${params.pid}/comments`,
  });
}