import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_BASE_URL } from '@/lib/config/api';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const per_page = searchParams.get('per_page');
    const page = searchParams.get('page');

    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (per_page) params.append('per_page', per_page);
    if (page) params.append('page', page);

    const response = await fetch(`${API_BASE_URL}/admin/products/import?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch imports' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching imports:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch imports' },
      { status: 500 }
    );
  }
}
