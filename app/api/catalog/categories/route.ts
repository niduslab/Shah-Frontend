import { NextRequest, NextResponse } from 'next/server';

import { API_ORIGIN } from '@/lib/config/api';
export async function GET(request: NextRequest) {
  try {
    const backendUrl = API_ORIGIN;
    
    const response = await fetch(`${backendUrl}/api/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
