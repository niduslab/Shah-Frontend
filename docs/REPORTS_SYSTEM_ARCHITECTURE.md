# Reports System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin Panel                               │
│                     /admin/reports                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Reports Page Component                      │
│                   (app/admin/reports/page.tsx)                   │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Sales     │  │  Products   │  │  Customers  │             │
│  │   Report    │  │   Report    │  │   Report    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │  Inventory  │  │ Order Status│                               │
│  │   Report    │  │   Report    │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Query Hooks                           │
│              (lib/hooks/admin/useReports.ts)                     │
│                                                                   │
│  • useSalesReport()                                              │
│  • useProductsReport()                                           │
│  • useCustomersReport()                                          │
│  • useInventoryReport()                                          │
│  • useOrderStatusReport()                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Client                               │
│                    (lib/api/axios.ts)                            │
│                                                                   │
│  • Authentication Headers                                        │
│  • Request Interceptors                                          │
│  • Response Interceptors                                         │
│  • Error Handling                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend API                                 │
│                  /api/admin/reports/*                            │
│                                                                   │
│  GET /api/admin/reports/sales                                    │
│  GET /api/admin/reports/products                                 │
│  GET /api/admin/reports/customers                                │
│  GET /api/admin/reports/inventory                                │
│  GET /api/admin/reports/order-status                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Database                                 │
│                                                                   │
│  • Orders Table                                                  │
│  • Products Table                                                │
│  • Users Table                                                   │
│  • Order Items Table                                             │
│  • Inventory Logs Table                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
ReportsPage
├── Header Section
│   ├── Icon (BarChart3)
│   ├── Title
│   └── Description
│
├── Report Tabs
│   ├── Sales Tab
│   ├── Products Tab
│   ├── Customers Tab
│   ├── Inventory Tab
│   └── Order Status Tab
│
├── Filters Panel
│   ├── Date From Input
│   ├── Date To Input
│   ├── Group By Select (Sales only)
│   ├── Limit Select (Products/Customers)
│   ├── Clear Button
│   └── Export Button
│
└── Report Content
    ├── Loading State
    ├── Empty State
    └── Data Display
        ├── Summary Cards
        └── Data Table
```

---

## Data Flow Diagram

```
┌──────────────┐
│     User     │
│   Interaction│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Tab Click   │
│  or Filter   │
│   Change     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  React State Update  │
│  (activeReport,      │
│   filters)           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  useQuery Hook       │
│  Triggered           │
│  (conditional)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐     ┌──────────────┐
│  Check Cache         │────▶│  Cache Hit?  │
│  (React Query)       │     │  Return Data │
└──────┬───────────────┘     └──────────────┘
       │ Cache Miss
       ▼
┌──────────────────────┐
│  API Request         │
│  with Filters        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Backend Processing  │
│  • Auth Check        │
│  • Query Database    │
│  • Calculate Metrics │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  JSON Response       │
│  {                   │
│    success: true,    │
│    data: {...}       │
│  }                   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Update Cache        │
│  (React Query)       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Component           │
│  Re-render           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Display Data        │
│  • Format Numbers    │
│  • Format Currency   │
│  • Format Dates      │
└────────────────────────┘
```

---

## State Management

```
Component State (useState)
├── mounted: boolean
├── activeReport: ReportType
├── dateFrom: string
├── dateTo: string
├── groupBy: GroupBy
├── limit: number
└── showFilters: boolean

Server State (React Query)
├── salesData
│   ├── data
│   ├── isLoading
│   ├── error
│   └── refetch()
│
├── productsData
│   ├── data
│   ├── isLoading
│   ├── error
│   └── refetch()
│
├── customersData
│   ├── data
│   ├── isLoading
│   ├── error
│   └── refetch()
│
├── inventoryData
│   ├── data
│   ├── isLoading
│   ├── error
│   └── refetch()
│
└── orderStatusData
    ├── data
    ├── isLoading
    ├── error
    └── refetch()
```

---

## API Request/Response Flow

### Sales Report

**Request:**
```http
GET /api/admin/reports/sales?date_from=2026-01-01&date_to=2026-03-01&group_by=day
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_revenue": 150000.00,
      "total_orders": 450,
      "average_order_value": 333.33
    },
    "sales": [
      {
        "period": "2026-01-01",
        "orders": 15,
        "revenue": 5000.00,
        "average_order_value": 333.33
      }
    ]
  }
}
```

### Products Report

**Request:**
```http
GET /api/admin/reports/products?date_from=2026-01-01&date_to=2026-03-01&limit=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "sku": "PROD-001",
        "category": "Electronics",
        "units_sold": 150,
        "revenue": 15000.00,
        "average_price": 100.00
      }
    ]
  }
}
```

---

## Caching Strategy

```
React Query Cache Configuration
├── staleTime: 5 minutes
├── cacheTime: 10 minutes
├── refetchOnWindowFocus: true
├── refetchOnMount: true
└── retry: 3 attempts

Cache Keys
├── ['admin', 'reports', 'sales', filters]
├── ['admin', 'reports', 'products', filters]
├── ['admin', 'reports', 'customers', filters]
├── ['admin', 'reports', 'inventory']
└── ['admin', 'reports', 'order-status', filters]

Cache Invalidation
├── On filter change
├── On tab switch (if stale)
├── On manual refetch
└── On mutation (if applicable)
```

---

## Error Handling Flow

```
┌──────────────┐
│ API Request  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Network Error?  │──Yes──▶ Show Error Toast
└──────┬───────────┘
       │ No
       ▼
┌──────────────────┐
│  Auth Error?     │──Yes──▶ Redirect to Login
└──────┬───────────┘
       │ No
       ▼
┌──────────────────┐
│  Server Error?   │──Yes──▶ Show Error Message
└──────┬───────────┘
       │ No
       ▼
┌──────────────────┐
│  Success         │──────▶ Display Data
└──────────────────┘
```

---

## Performance Optimization

### Conditional Rendering
```typescript
// Only fetch data for active report
const { data: salesData } = useSalesReport(
  filters,
  { enabled: activeReport === 'sales' }
);
```

### Memoization
```typescript
// Memoize expensive calculations
const formattedData = useMemo(() => {
  return data?.map(item => ({
    ...item,
    formattedPrice: formatCurrency(item.price)
  }));
}, [data]);
```

### SSR Safety
```typescript
// Prevent hydration mismatches
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return '';
```

---

## Security Architecture

```
┌──────────────────┐
│  User Request    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Auth Middleware │
│  • Check Token   │
│  • Verify Admin  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Route Handler   │
│  • Validate Input│
│  • Sanitize Data │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Database Query  │
│  • Parameterized │
│  • Scoped Access │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Response        │
│  • Sanitized     │
│  • Formatted     │
└──────────────────┘
```

---

## Responsive Design Breakpoints

```
Mobile (< 640px)
├── Single column layout
├── Stacked cards
├── Horizontal scroll tables
└── Collapsed filters

Tablet (640px - 1024px)
├── 2 column grid
├── Side-by-side cards
├── Responsive tables
└── Visible filters

Desktop (> 1024px)
├── 3-4 column grid
├── Full-width tables
├── Expanded filters
└── Optimal spacing
```

---

## File Structure

```
project/
├── app/
│   └── admin/
│       ├── reports/
│       │   └── page.tsx          # Main reports page
│       ├── layout.tsx             # Admin layout
│       └── _components/
│           └── admin-sidebar.tsx  # Navigation
│
├── lib/
│   ├── hooks/
│   │   └── admin/
│   │       └── useReports.ts      # Report hooks
│   └── api/
│       └── axios.ts               # API client
│
└── docs/
    ├── ADMIN_REPORTS_COMPLETE.md
    ├── REPORTS_QUICK_REFERENCE.md
    ├── REPORTS_IMPLEMENTATION_SUMMARY.md
    └── REPORTS_SYSTEM_ARCHITECTURE.md  # This file
```

---

## Integration Points

### With Admin Panel
```
Admin Sidebar
    └── Reports Link (/admin/reports)
            └── Reports Page
                ├── Uses Admin Layout
                ├── Requires Admin Auth
                └── Follows Admin Design System
```

### With API
```
Reports Page
    └── useReports Hooks
            └── Axios Client
                    └── API Endpoints
                            └── Backend Controllers
                                    └── Database
```

### With Design System
```
Reports Page
    ├── Uses Tailwind Classes
    ├── Follows Color Scheme
    ├── Uses Lucide Icons
    └── Matches Admin UI Patterns
```

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Production Server            │
│                                      │
│  ┌────────────────────────────────┐ │
│  │      Next.js Application       │ │
│  │                                │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │   Reports Page (SSR)     │ │ │
│  │  └──────────────────────────┘ │ │
│  │                                │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │   API Routes             │ │ │
│  │  └──────────────────────────┘ │ │
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │      Database Connection       │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│              CDN                     │
│  • Static Assets                     │
│  • Images                            │
│  • Fonts                             │
└─────────────────────────────────────┘
```

---

## Monitoring & Analytics

### Performance Metrics
- Page load time
- API response time
- Cache hit rate
- Error rate
- User engagement

### User Analytics
- Most viewed reports
- Filter usage patterns
- Export frequency
- Session duration
- Bounce rate

### System Health
- API availability
- Database performance
- Memory usage
- CPU usage
- Network latency

---

## Conclusion

This architecture provides:
- ✅ Scalable component structure
- ✅ Efficient data fetching
- ✅ Proper error handling
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Responsive design
- ✅ Maintainable codebase

The system is production-ready and follows industry best practices for modern web applications.
