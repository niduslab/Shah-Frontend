# Shipping API - Quick Reference

## Quick Start

```typescript
// Import hooks
import { 
  useShippingRates, 
  useCreateShippingRate,
  useShippingClasses 
} from '@/lib/hooks/admin/useShipping';

// List shipping rates
const { data, isLoading } = useShippingRates();
const rates = data?.data?.data || [];

// Create shipping rate
const createRate = useCreateShippingRate();
await createRate.mutateAsync({
  name: 'Standard Pathao',
  method: 'pathao_courier',
  base_cost: 80,
  is_active: true,
});
```

## Admin Hooks

### Shipping Rates

```typescript
// List rates with filters
useShippingRates({ 
  method: 'pathao_courier',
  is_active: 'true',
  page: 1,
  per_page: 15 
});

// Get single rate
useShippingRate(rateId);

// Create rate
useCreateShippingRate({
  onSuccess: () => console.log('Created'),
  onError: (error) => console.error(error),
});

// Update rate
useUpdateShippingRate({
  onSuccess: () => console.log('Updated'),
});

// Delete rate
useDeleteShippingRate({
  onSuccess: () => console.log('Deleted'),
});
```

### Shipping Classes

```typescript
// List all classes
useShippingClasses();

// Get single class
useShippingClass(classId);

// Create class
useCreateShippingClass({
  onSuccess: () => console.log('Created'),
});

// Update class
useUpdateShippingClass({
  onSuccess: () => console.log('Updated'),
});

// Delete class
useDeleteShippingClass({
  onSuccess: () => console.log('Deleted'),
});
```

## API Endpoints

### Shipping Rates

```bash
# List rates
GET /api/admin/shipping-rates?method=pathao_courier&is_active=true&page=1

# Get single rate
GET /api/admin/shipping-rates/1

# Create rate
POST /api/admin/shipping-rates
{
  "name": "Standard Pathao",
  "method": "pathao_courier",
  "base_cost": 80,
  "free_shipping_threshold": 5000,
  "is_active": true
}

# Update rate
PUT /api/admin/shipping-rates/1
{
  "base_cost": 90
}

# Delete rate
DELETE /api/admin/shipping-rates/1
```

### Shipping Classes

```bash
# List classes
GET /api/admin/shipping-classes

# Get single class
GET /api/admin/shipping-classes/1

# Create class
POST /api/admin/shipping-classes
{
  "name": "Heavy Equipment",
  "description": "Large fitness equipment"
}

# Update class
PUT /api/admin/shipping-classes/1
{
  "description": "Updated description"
}

# Delete class
DELETE /api/admin/shipping-classes/1
```

## Data Types

### ShippingRateData

```typescript
{
  name: string;                          // Required
  method: 'shah_sports_team' | 'pathao_courier';  // Required
  shipping_class_id?: number | null;     // Optional
  zone?: string | null;                  // Optional
  base_cost: number;                     // Required
  per_kg_cost?: number | null;           // Optional
  min_weight?: number | null;            // Optional
  max_weight?: number | null;            // Optional
  free_shipping_threshold?: number | null;  // Optional
  delivery_time?: string | null;         // Optional
  is_active?: boolean;                   // Optional (default: true)
}
```

### ShippingClassData

```typescript
{
  name: string;              // Required
  description?: string | null;  // Optional
}
```

## Common Patterns

### Create Rate with All Options

```typescript
const createRate = useCreateShippingRate();

await createRate.mutateAsync({
  name: 'Premium Pathao Dhaka',
  method: 'pathao_courier',
  shipping_class_id: 1,
  zone: 'Dhaka',
  base_cost: 100,
  per_kg_cost: 15,
  min_weight: 0,
  max_weight: 100,
  free_shipping_threshold: 10000,
  delivery_time: '1-2 business days',
  is_active: true,
});
```

### Update Rate Status

```typescript
const updateRate = useUpdateShippingRate();

await updateRate.mutateAsync({
  id: rateId,
  data: { is_active: false }
});
```

### Filter Active Pathao Rates

```typescript
const { data } = useShippingRates({
  method: 'pathao_courier',
  is_active: 'true',
});
```

### Create Class and Assign to Rate

```typescript
// 1. Create class
const createClass = useCreateShippingClass();
const classResult = await createClass.mutateAsync({
  name: 'Heavy Equipment',
  description: 'Large fitness equipment',
});

// 2. Create rate with class
const createRate = useCreateShippingRate();
await createRate.mutateAsync({
  name: 'Heavy Equipment Rate',
  method: 'shah_sports_team',
  shipping_class_id: classResult.data.id,
  base_cost: 200,
});
```

## Error Handling

```typescript
const createRate = useCreateShippingRate({
  onError: (error: any) => {
    if (error.response?.data?.errors) {
      // Validation errors
      const errors = error.response.data.errors;
      console.error('Validation errors:', errors);
      // errors.name, errors.base_cost, etc.
    } else if (error.response?.status === 401) {
      // Unauthorized
      console.error('Not authenticated');
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Not authorized');
    } else {
      // Other errors
      console.error('Unknown error:', error.message);
    }
  },
});
```

## Loading States

```typescript
const { data, isLoading, isError, error } = useShippingRates();

if (isLoading) return <Spinner />;
if (isError) return <Error message={error.message} />;

const rates = data?.data?.data || [];
```

## Mutation States

```typescript
const createRate = useCreateShippingRate();

// Check if mutation is in progress
if (createRate.isPending) {
  console.log('Creating...');
}

// Check if mutation succeeded
if (createRate.isSuccess) {
  console.log('Created successfully');
}

// Check if mutation failed
if (createRate.isError) {
  console.error('Failed:', createRate.error);
}
```

## Pagination

```typescript
const [page, setPage] = useState(1);

const { data } = useShippingRates({ 
  page, 
  per_page: 15 
});

const pagination = data?.data?.pagination;

// Next page
if (page < pagination.last_page) {
  setPage(page + 1);
}

// Previous page
if (page > 1) {
  setPage(page - 1);
}
```

## Query Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate all shipping rates queries
queryClient.invalidateQueries({ 
  queryKey: ['admin', 'shipping-rates'] 
});

// Invalidate specific rate
queryClient.invalidateQueries({ 
  queryKey: ['admin', 'shipping-rate', rateId] 
});

// Invalidate all shipping classes
queryClient.invalidateQueries({ 
  queryKey: ['admin', 'shipping-classes'] 
});
```

## Optimistic Updates

```typescript
const updateRate = useUpdateShippingRate({
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ 
      queryKey: ['admin', 'shipping-rates'] 
    });

    // Snapshot previous value
    const previousRates = queryClient.getQueryData(['admin', 'shipping-rates']);

    // Optimistically update
    queryClient.setQueryData(['admin', 'shipping-rates'], (old: any) => {
      return {
        ...old,
        data: {
          ...old.data,
          data: old.data.data.map((rate: any) =>
            rate.id === variables.id
              ? { ...rate, ...variables.data }
              : rate
          ),
        },
      };
    });

    return { previousRates };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    if (context?.previousRates) {
      queryClient.setQueryData(
        ['admin', 'shipping-rates'],
        context.previousRates
      );
    }
  },
});
```

## Validation Examples

### Rate Validation

```typescript
const validateRate = (data: ShippingRateData) => {
  const errors: Record<string, string> = {};

  if (!data.name) {
    errors.name = 'Name is required';
  }

  if (!data.method) {
    errors.method = 'Method is required';
  }

  if (data.base_cost < 0) {
    errors.base_cost = 'Base cost must be 0 or greater';
  }

  if (data.min_weight && data.max_weight && data.min_weight > data.max_weight) {
    errors.max_weight = 'Max weight must be greater than min weight';
  }

  return errors;
};
```

### Class Validation

```typescript
const validateClass = (data: ShippingClassData) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  return errors;
};
```

## Testing Examples

### Unit Test

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useShippingRates } from '@/lib/hooks/admin/useShipping';

test('fetches shipping rates', async () => {
  const { result } = renderHook(() => useShippingRates());

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data?.data?.data).toBeDefined();
});
```

### Integration Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ShippingRatesPage from '@/app/admin/shipping-rates/page';

test('creates new shipping rate', async () => {
  render(<ShippingRatesPage />);

  // Click add button
  fireEvent.click(screen.getByText('Add Shipping Rate'));

  // Fill form
  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'Test Rate' },
  });

  // Submit
  fireEvent.click(screen.getByText('Create'));

  // Verify success
  await waitFor(() => {
    expect(screen.getByText('Test Rate')).toBeInTheDocument();
  });
});
```

## Performance Tips

1. **Use pagination** for large datasets
2. **Enable caching** with staleTime
3. **Debounce filters** to reduce API calls
4. **Use optimistic updates** for better UX
5. **Invalidate queries** selectively

```typescript
// Example: Cached query with 5 minute stale time
useShippingRates(
  { page: 1 },
  { staleTime: 5 * 60 * 1000 }
);
```

## Troubleshooting

### Rate not appearing in list
- Check if `is_active` is true
- Verify filters aren't excluding it
- Refresh the page
- Check browser console for errors

### Cannot delete class
- Ensure no products are assigned
- Check products_count in response
- Reassign products first

### Validation errors not showing
- Check error response format
- Verify error state is set
- Check error.response.data.errors

### CORS errors
- Verify API URL in axios config
- Check backend CORS settings
- Ensure withCredentials is true

---

**Quick Reference Complete!** 📚

For detailed examples, see `FRONTEND_SHIPPING_IMPLEMENTATION_GUIDE.md`
