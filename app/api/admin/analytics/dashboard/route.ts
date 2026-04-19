import { NextRequest } from "next/server";
import { proxyToLaravel } from "../_lib/proxy";

export async function GET(request: NextRequest) {
  return proxyToLaravel(request, "/api/admin/analytics/dashboard");
}
