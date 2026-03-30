import { NextRequest, NextResponse } from 'next/server';
import { createPaginatedResponse } from '@/lib/utils/pagination';

// Mock orders data - replace with actual database call
const MOCK_ORDERS = [
  {
    id: 46,
    user_id: 2,
    order_number: 'SS-20260324-Y6UNPL',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 2,
    billing_address_id: 2,
    subtotal: '10033.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '10033.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-24T09:28:51.000000Z',
    updated_at: '2026-03-24T09:28:51.000000Z',
    items_count: 2,
  },
  {
    id: 45,
    user_id: 2,
    order_number: 'SS-20260324-AYAOAM',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '10000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '10000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-24T06:33:49.000000Z',
    updated_at: '2026-03-24T06:33:49.000000Z',
    items_count: 1,
  },
  {
    id: 44,
    user_id: 2,
    order_number: 'SS-20260312-JHIJET',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '30000.00',
    shipping_cost: '0.00',
    discount_amount: '3000.00',
    tax_amount: '0.00',
    total_amount: '27000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: '7384821',
    status: 'processing',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-12T06:55:12.000000Z',
    updated_at: '2026-03-24T06:21:42.000000Z',
    items_count: 3,
  },
  {
    id: 43,
    user_id: 2,
    order_number: 'SS-20260312-OPBIES',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '21000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '21000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-12T06:53:41.000000Z',
    updated_at: '2026-03-12T06:53:41.000000Z',
    items_count: 2,
  },
  {
    id: 42,
    user_id: 2,
    order_number: 'SS-20260311-ZIXZSU',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '50000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '50000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:38:16.000000Z',
    updated_at: '2026-03-11T17:38:16.000000Z',
    items_count: 5,
  },
  {
    id: 41,
    user_id: 2,
    order_number: 'SS-20260311-ILBFYU',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '50000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '50000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'pending',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:28:00.000000Z',
    updated_at: '2026-03-11T17:28:00.000000Z',
    items_count: 5,
  },
  {
    id: 40,
    user_id: 2,
    order_number: 'SS-20260311-WRBQPO',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '10000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '10000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:27:25.000000Z',
    updated_at: '2026-03-11T17:27:25.000000Z',
    items_count: 1,
  },
  {
    id: 39,
    user_id: 2,
    order_number: 'SS-20260311-RCCRMN',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '10000.00',
    shipping_cost: '0.00',
    discount_amount: '0.00',
    tax_amount: '0.00',
    total_amount: '10000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:26:57.000000Z',
    updated_at: '2026-03-11T17:26:57.000000Z',
    items_count: 1,
  },
  {
    id: 38,
    user_id: 2,
    order_number: 'SS-20260311-EELFMN',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '10000.00',
    shipping_cost: '0.00',
    discount_amount: '1000.00',
    tax_amount: '0.00',
    total_amount: '9000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:19:06.000000Z',
    updated_at: '2026-03-11T17:19:06.000000Z',
    items_count: 1,
  },
  {
    id: 37,
    user_id: 2,
    order_number: 'SS-20260311-YBIIWR',
    order_type: 'online',
    is_preorder: false,
    shipping_address_id: 1,
    billing_address_id: 1,
    subtotal: '18000.00',
    shipping_cost: '0.00',
    discount_amount: '2000.00',
    tax_amount: '0.00',
    total_amount: '18000.00',
    coupon_id: null,
    shipping_method: 'shah_sports_team',
    tracking_number: null,
    status: 'confirmed',
    payment_status: 'pending',
    notes: null,
    created_at: '2026-03-11T17:10:52.000000Z',
    updated_at: '2026-03-11T17:10:52.000000Z',
    items_count: 2,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Filter orders
    let filteredOrders = MOCK_ORDERS;

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }

    // Filter by search (order number)
    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        order.order_number.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by created_at descending (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Paginate
    const total = filteredOrders.length;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Return paginated response
    const response = createPaginatedResponse(paginatedOrders, page, perPage, total);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
