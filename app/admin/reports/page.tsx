'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useSalesReport,
  useProductsReport,
  useCustomersReport,
  useInventoryReport,
  useOrderStatusReport
} from '@/lib/hooks/admin/useReports';

type ReportType = 'sales' | 'products' | 'customers' | 'inventory' | 'order-status';
type GroupBy = 'day' | 'week' | 'month' | 'year';

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeReport, setActiveReport] = useState<ReportType>('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('day');
  const [limit, setLimit] = useState(20);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  const salesFilters = {
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
    group_by: groupBy
  };


  const productsFilters = {
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
    limit
  };

  const customersFilters = {
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
    limit
  };

  const orderStatusFilters = {
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo })
  };

  const { data: salesData, isLoading: salesLoading } = useSalesReport(
    salesFilters,
    { enabled: activeReport === 'sales' } as any
  );

  const { data: productsData, isLoading: productsLoading } = useProductsReport(
    productsFilters,
    { enabled: activeReport === 'products' } as any
  );

  const { data: customersData, isLoading: customersLoading } = useCustomersReport(
    customersFilters,
    { enabled: activeReport === 'customers' } as any
  );

  const { data: inventoryData, isLoading: inventoryLoading } = useInventoryReport(
    { enabled: activeReport === 'inventory' } as any
  );

  const { data: orderStatusData, isLoading: orderStatusLoading } = useOrderStatusReport(
    orderStatusFilters,
    { enabled: activeReport === 'order-status' } as any
  );

  const isLoading = salesLoading || productsLoading || customersLoading || inventoryLoading || orderStatusLoading;

  const reportTabs = [
    { id: 'sales' as ReportType, label: 'Sales Report', icon: DollarSign, color: 'emerald' },
    { id: 'products' as ReportType, label: 'Products Report', icon: Package, color: 'blue' },
    { id: 'customers' as ReportType, label: 'Customers Report', icon: Users, color: 'purple' },
    { id: 'inventory' as ReportType, label: 'Inventory Report', icon: ShoppingCart, color: 'orange' },
    { id: 'order-status' as ReportType, label: 'Order Status', icon: BarChart3, color: 'indigo' }
  ];

  const clearFilters = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateTo(today.toISOString().split('T')[0]);
    setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
    setGroupBy('day');
    setLimit(20);
  };

  const handleExport = () => {
    toast.info('Export feature', {
      description: 'Export functionality will be implemented soon.'
    });
  };

  const formatCurrency = (amount: number) => {
    if (!mounted) return '';
    return `৳${(Number.isFinite(amount) ? amount : 0).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num: number) => {
    if (!mounted) return '';
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6F00] to-[#E65100] shadow-lg shadow-orange-500/30">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">View detailed business insights and reports</p>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <div className="mb-6 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-wrap gap-2">
            {reportTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeReport === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white shadow-lg shadow-orange-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-200 sm:p-5">
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all sm:w-auto"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date From */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                />
              </div>

              {/* Group By (for sales report) */}
              {activeReport === 'sales' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Group By</label>
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  >
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              )}

              {/* Limit (for products and customers reports) */}
              {(activeReport === 'products' || activeReport === 'customers') && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Limit</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#FF6F00] focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20"
                  >
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                    <option value={100}>Top 100</option>
                  </select>
                </div>
              )}

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Report Content */}
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-200 p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF6F00]"></div>
                </div>
                <p className="text-sm font-medium text-gray-600">Loading report data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sales Report */}
              {activeReport === 'sales' && salesData?.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Report</h2>
                  
                  {/* Summary Cards */}
                  {salesData.data.summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 ring-1 ring-emerald-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                            <p className="text-2xl font-bold text-emerald-900 mt-1">
                              {formatCurrency(salesData.data.summary.total_revenue || 0)}
                            </p>
                          </div>
                          <DollarSign className="h-10 w-10 text-emerald-600 opacity-50" />
                        </div>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 ring-1 ring-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700">Total Orders</p>
                            <p className="text-2xl font-bold text-blue-900 mt-1">
                              {formatNumber(salesData.data.summary.total_orders || 0)}
                            </p>
                          </div>
                          <ShoppingCart className="h-10 w-10 text-blue-600 opacity-50" />
                        </div>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 ring-1 ring-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700">Average Order Value</p>
                            <p className="text-2xl font-bold text-purple-900 mt-1">
                              {formatCurrency(salesData.data.summary.average_order_value || 0)}
                            </p>
                          </div>
                          <TrendingUp className="h-10 w-10 text-purple-600 opacity-50" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sales Data Table */}
                  {salesData.data.sales && salesData.data.sales.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Period</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avg Order</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {salesData.data.sales.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">{item.period || item.date}</td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatNumber(item.orders || 0)}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(item.revenue || 0)}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(item.average_order_value || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No sales data available for the selected period</div>
                  )}
                </div>
              )}

              {/* Products Report */}
              {activeReport === 'products' && productsData?.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
                  
                  {productsData.data.products && productsData.data.products.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Units Sold</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revenue</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avg Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {productsData.data.products.map((product: any, index: number) => (
                            <tr key={product.id || index} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{product.name || product.product_name}</div>
                                {product.category && (
                                  <div className="text-xs text-gray-500">{product.category}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm font-mono text-gray-600">{product.sku || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatNumber(product.units_sold || product.quantity_sold || 0)}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(product.revenue || product.total_revenue || 0)}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(product.average_price || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No product data available</div>
                  )}
                </div>
              )}

              {/* Customers Report */}
              {activeReport === 'customers' && customersData?.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Top Customers</h2>
                  
                  {customersData.data.customers && customersData.data.customers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Spent</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avg Order</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {customersData.data.customers.map((customer: any, index: number) => (
                            <tr key={customer.id || index} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white text-sm font-bold">
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white text-sm font-semibold">
                                    {customer.first_name?.charAt(0) || ''}{customer.last_name?.charAt(0) || ''}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {customer.first_name} {customer.last_name}
                                    </div>
                                    <div className="text-xs text-gray-500">ID: {customer.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatNumber(customer.total_orders || customer.orders_count || 0)}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{formatCurrency(customer.total_spent || customer.total_amount || 0)}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(customer.average_order_value || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No customer data available</div>
                  )}
                </div>
              )}

              {/* Inventory Report */}
              {activeReport === 'inventory' && inventoryData?.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Inventory Report</h2>
                  
                  {/* Summary Cards */}
                  {inventoryData.data.summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 ring-1 ring-blue-200">
                        <p className="text-sm font-medium text-blue-700">Total Products</p>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                          {formatNumber(inventoryData.data.summary.total_products || 0)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 ring-1 ring-emerald-200">
                        <p className="text-sm font-medium text-emerald-700">In Stock</p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">
                          {formatNumber(inventoryData.data.summary.in_stock || 0)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 ring-1 ring-yellow-200">
                        <p className="text-sm font-medium text-yellow-700">Low Stock</p>
                        <p className="text-2xl font-bold text-yellow-900 mt-1">
                          {formatNumber(inventoryData.data.summary.low_stock || 0)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-4 ring-1 ring-red-200">
                        <p className="text-sm font-medium text-red-700">Out of Stock</p>
                        <p className="text-2xl font-bold text-red-900 mt-1">
                          {formatNumber(inventoryData.data.summary.out_of_stock || 0)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Inventory Items */}
                  {inventoryData.data.items && inventoryData.data.items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {inventoryData.data.items.map((item: any) => {
                            const stockStatus = item.stock_status || (item.quantity > 0 ? 'in_stock' : 'out_of_stock');
                            const statusColors = {
                              in_stock: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
                              low_stock: 'bg-yellow-100 text-yellow-700 ring-yellow-600/20',
                              out_of_stock: 'bg-red-100 text-red-700 ring-red-600/20'
                            };

                            return (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="font-medium text-gray-900">{item.name || item.product_name}</div>
                                  {item.category && (
                                    <div className="text-xs text-gray-500">{item.category}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.sku || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatNumber(item.quantity || 0)}</td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${statusColors[stockStatus as keyof typeof statusColors] || statusColors.in_stock}`}>
                                    {stockStatus.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                  {formatCurrency((item.quantity || 0) * (item.price || 0))}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No inventory data available</div>
                  )}
                </div>
              )}

              {/* Order Status Report */}
              {activeReport === 'order-status' && orderStatusData?.data && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Report</h2>
                  
                  {orderStatusData.data.status_breakdown && orderStatusData.data.status_breakdown.length > 0 ? (
                    <div>
                      {/* Status Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {orderStatusData.data.status_breakdown.map((status: any) => {
                          const statusColors: Record<string, { bg: string; text: string; ring: string }> = {
                            pending: { bg: 'from-yellow-50 to-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-200' },
                            confirmed: { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' },
                            processing: { bg: 'from-purple-50 to-purple-100', text: 'text-purple-700', ring: 'ring-purple-200' },
                            shipped: { bg: 'from-indigo-50 to-indigo-100', text: 'text-indigo-700', ring: 'ring-indigo-200' },
                            delivered: { bg: 'from-emerald-50 to-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' },
                            cancelled: { bg: 'from-red-50 to-red-100', text: 'text-red-700', ring: 'ring-red-200' }
                          };

                          const colors = statusColors[status.status] || statusColors.pending;

                          return (
                            <div key={status.status} className={`rounded-xl bg-gradient-to-br ${colors.bg} p-4 ring-1 ${colors.ring}`}>
                              <p className={`text-sm font-medium ${colors.text}`}>
                                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                              </p>
                              <p className={`text-2xl font-bold ${colors.text} mt-1`}>
                                {formatNumber(status.count || 0)}
                              </p>
                              {status.total_amount && (
                                <p className={`text-xs ${colors.text} mt-1 opacity-75`}>
                                  {formatCurrency(status.total_amount)}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Count</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orderStatusData.data.status_breakdown.map((status: any) => {
                              const total = orderStatusData.data.status_breakdown.reduce((sum: number, s: any) => sum + (s.count || 0), 0);
                              const percentage = total > 0 ? ((status.count || 0) / total * 100).toFixed(1) : '0.0';

                              return (
                                <tr key={status.status} className="hover:bg-gray-50">
                                  <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900 capitalize">{status.status}</span>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatNumber(status.count || 0)}</td>
                                  <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                                    {formatCurrency(status.total_amount || 0)}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                        <div 
                                          className="bg-[#FF6F00] h-2 rounded-full" 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No order status data available</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
