import { NextRequest, NextResponse } from "next/server";

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Proxy requests to Laravel backend API
 * @param request - Next.js request object
 * @param endpoint - Laravel API endpoint (e.g., "/api/admin/analytics/dashboard")
 * @returns NextResponse with Laravel API response
 */
export async function proxyToLaravel(
  request: NextRequest,
  endpoint: string
): Promise<NextResponse> {
  try {
    // Get query parameters and build query string
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Get authorization header from request
    const authHeader = request.headers.get("authorization");

    // Build Laravel API URL with query params
    const laravelUrl = `${LARAVEL_API_URL}${endpoint}${queryString ? `?${queryString}` : ""}`;

    // Forward request to Laravel backend
    const response = await fetch(laravelUrl, {
      method: request.method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        ...(authHeader ? { "Authorization": authHeader } : {}),
      },
      // Include body for POST/PUT/PATCH requests
      ...(request.method !== "GET" && request.method !== "HEAD"
        ? { body: JSON.stringify(await request.json()) }
        : {}),
    });

    // Get response data
    const data = await response.json();

    // Return Laravel response with same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`Error proxying to Laravel ${endpoint}:`, error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch data from backend",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
