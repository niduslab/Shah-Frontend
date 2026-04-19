import { NextRequest } from "next/server";
import { proxyToLaravel } from "../../_lib/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return proxyToLaravel(request, `/api/admin/analytics/visitors/${id}`);
}
