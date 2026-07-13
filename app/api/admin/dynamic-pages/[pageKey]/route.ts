import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL } from '@/lib/config/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const response = await fetch(
      `${API_BASE_URL}/admin/dynamic-pages/${pageKey}`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch page" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/admin/dynamic-pages/${pageKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update page" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageKey: string }> }
) {
  try {
    const { pageKey } = await params;
    const response = await fetch(
      `${API_BASE_URL}/admin/dynamic-pages/${pageKey}`,
      {
        method: "DELETE",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete page" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
