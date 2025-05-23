import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/comments`;

export async function GET(req: NextRequest, { params }: { params: { cmid: string } }) {
  return proxyRequest(req, {
    method: 'GET',
    backendUrl: `${URL}/${params.cmid}`,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { cmid: string } }) {
  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${params.cmid}`,
    withBody: true,
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { cmid: string } }) {
  return proxyRequest(req, {
    method: 'DELETE',
    backendUrl: `${URL}/${params.cmid}`,
  });
}