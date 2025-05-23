import { proxyRequest } from "@/lib/api/proxyRequest";
import { NextRequest } from "next/server";

const URL = `${process.env.NEXT_PUBLIC_API_URL}v1/comments`;

// TODO: Discuss with Gleb
export async function PUT(req: NextRequest, { params }: { params: { cmid: string } }) {
  return proxyRequest(req, {
    method: 'PUT',
    backendUrl: `${URL}/${params.cmid}/likes`,
    withBody: true,
  });
}