import { NextRequest } from "next/server";
import { proxyToLaravel } from "../../_lib/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToLaravel(request, `/api/admin/analytics/visitors/${id}`);
}
