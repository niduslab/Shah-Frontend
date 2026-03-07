# Reports System - Quick Reference

## Access
**URL**: `/admin/reports`  
**Navigation**: Admin Sidebar → Reports

## Available Reports

### 📊 Sales Report
**What it shows**: Revenue, orders, and average order value over time

**Filters**:
- Date range (from/to)
- Group by: Day, Week, Month, Year

**Key Metrics**:
- Total Revenue
- Total Orders
- Average Order Value
- Period-by-period breakdown

---

### 📦 Products Report
**What it shows**: Top selling products by revenue and units sold

**Filters**:
- Date range (from/to)
- Limit: Top 10, 20, 50, or 100

**Key Metrics**:
- Product ranking
- Units sold
- Revenue per product
- Average price
- SKU and category

---

### 👥 Customers Report
**What it shows**: Top customers by spending and order frequency

**Filters**:
- Date range (from/to)
- Limit: Top 10, 20, 50, or 100

**Key Metrics**:
- Customer ranking
- Total orders
- Total spent
- Average order value
- Customer details

---

### 📋 Inventory Report
**What it shows**: Current stock levels and inventory status

**Filters**: None (shows current state)

**Key Metrics**:
- Total products
- In stock count
- Low stock alerts
- Out of stock count
- Inventory value
- Product-level details

---

### 📈 Order Status Report
**What it shows**: Distribution of orders by status

**Filters**:
- Date range (from/to)

**Key Metrics**:
- Count by status (Pending, Confirmed, Processing, Shipped, Delivered, Cancelled)
- Total amount by status
- Percentage distribution
- Visual breakdown

---

## Quick Actions

### Filter Controls
- **Date Range**: Select from/to dates for time-based reports
- **Group By**: Choose aggregation level (Sales report only)
- **Limit**: Select number of top results (Products/Customers)
- **Clear**: Reset all filters to defaults
- **Export**: Download report data (coming soon)

### Default Settings
- Date range: Last 30 days
- Group by: Day
- Limit: Top 20

---

## API Endpoints

```
GET /api/admin/reports/sales
GET /api/admin/reports/products
GET /api/admin/reports/customers
GET /api/admin/reports/inventory
GET /api/admin/reports/order-status
```

All endpoints require admin authentication.

---

## Using the Hooks

```typescript
import {
  useSalesReport,
  useProductsReport,
  useCustomersReport,
  useInventoryReport,
  useOrderStatusReport
} from '@/lib/hooks/admin/useReports';

// Sales Report
const { data, isLoading } = useSalesReport({
  date_from: '2026-01-01',
  date_to: '2026-03-01',
  group_by: 'day'
});

// Products Report
const { data, isLoading } = useProductsReport({
  date_from: '2026-01-01',
  date_to: '2026-03-01',
  limit: 20
});

// Customers Report
const { data, isLoading } = useCustomersReport({
  date_from: '2026-01-01',
  date_to: '2026-03-01',
  limit: 20
});

// Inventory Report
const { data, isLoading } = useInventoryReport();

// Order Status Report
const { data, isLoading } = useOrderStatusReport({
  date_from: '2026-01-01',
  date_to: '2026-03-01'
});
```

---

## Color Coding

### Status Colors
- 🟢 **Green/Emerald**: Success, Delivered, In Stock, Revenue
- 🔵 **Blue**: Info, Confirmed, Total Products
- 🟣 **Purple**: Processing, Customers
- 🟡 **Yellow**: Pending, Low Stock, Warnings
- 🔴 **Red**: Cancelled, Out of Stock, Failed
- 🟠 **Orange**: Primary actions, Pre-orders
- 🔷 **Indigo**: Shipped

---

## Tips

1. **Performance**: Only the active report fetches data
2. **Caching**: React Query caches results automatically
3. **Responsive**: All reports work on mobile devices
4. **Real-time**: Data updates when filters change
5. **Empty States**: Clear messages when no data available

---

## Common Use Cases

### Daily Sales Check
1. Go to Reports → Sales Report
2. Set date range to today
3. View total revenue and orders

### Find Best Sellers
1. Go to Reports → Products Report
2. Set date range (e.g., last month)
3. View top 20 products

### Identify VIP Customers
1. Go to Reports → Customers Report
2. Set date range (e.g., last year)
3. View top spenders

### Check Stock Levels
1. Go to Reports → Inventory Report
2. Review low stock and out of stock items
3. Plan restocking

### Monitor Order Flow
1. Go to Reports → Order Status Report
2. View distribution across statuses
3. Identify bottlenecks

---

## Troubleshooting

**No data showing?**
- Check date range filters
- Verify you have data for the selected period
- Try clearing filters

**Loading forever?**
- Check network connection
- Verify API endpoint is accessible
- Check browser console for errors

**Wrong numbers?**
- Verify date range is correct
- Check timezone settings
- Ensure filters are applied correctly

---

## Related Documentation
- Full API Documentation: `COMPLETE_API_DOCUMENTATION.md`
- Implementation Details: `ADMIN_REPORTS_COMPLETE.md`
- API Quick Reference: `API_QUICK_REFERENCE.md`
