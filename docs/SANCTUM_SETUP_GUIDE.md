# Laravel Sanctum Authentication Setup Guide

## ✅ Installation Complete

Your Next.js application is now configured for Laravel Sanctum HTTP-only cookie authentication.

## 📁 Files Created

### Core Authentication Files
- `lib/api/axios.ts` - Axios instance with credentials enabled
- `lib/services/authService.ts` - Authentication service methods
- `lib/context/AuthContext.tsx` - React context for auth state
- `app/_components/ProtectedRoute.tsx` - Route protection component
- `app/_components/UserProfile.tsx` - Example user profile component

### Updated Pages
- `app/(auth)/login/page.tsx` - Login form with Sanctum integration
- `app/(auth)/register/page.tsx` - Registration form with Sanctum integration
- `app/layout.tsx` - Root layout with AuthProvider

### Example Files
- `lib/api/examples.ts` - Example API calls for your Laravel backend
- `.env.local.example` - Environment variable template

## 🚀 Quick Start

### 1. Configure Environment Variables

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 2. Verify Laravel Backend Configuration

Ensure your Laravel `.env` has:

```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
FRONTEND_URL=http://localhost:3000
APP_URL=http://127.0.0.1:8000
SESSION_SECURE_COOKIE=false
```

### 3. Start Development Servers

Terminal 1 - Laravel Backend:
```bash
cd your-laravel-project
php artisan serve
```

Terminal 2 - Next.js Frontend:
```bash
npm run dev
```

### 4. Test Authentication Flow

1. Navigate to `http://localhost:3000/register`
2. Create a new account
3. You'll be automatically logged in and redirected to `/admin`
4. Try logging out and logging back in at `/login`

## 🔐 How It Works

### HTTP-Only Cookies
- Laravel sends session cookies that JavaScript cannot access
- Cookies are automatically included in all requests via `withCredentials: true`
- No need to manually manage tokens in localStorage or state

### CSRF Protection
- Before login/register, the app fetches a CSRF cookie from `/sanctum/csrf-cookie`
- Laravel validates the CSRF token on subsequent requests
- This prevents cross-site request forgery attacks

### Authentication Flow
1. User submits login form
2. `authService.getCsrfCookie()` fetches CSRF token
3. `authService.login()` sends credentials
4. Laravel creates session and sends HTTP-only cookie
5. All subsequent API calls include the cookie automatically
6. `authService.getUser()` verifies authentication on page load

## 📝 Usage Examples

### Protecting Routes

Wrap any page that requires authentication:

```tsx
import ProtectedRoute from '@/app/_components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Context

Access user data and auth methods anywhere:

```tsx
'use client';

import { useAuth } from '@/lib/context/AuthContext';

export default function MyComponent() {
  const { user, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

All API calls automatically include authentication cookies:

```tsx
import api from '@/lib/api/axios';

// Simple GET request
const fetchProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

// POST request with data
const createOrder = async (orderData) => {
  const response = await api.post('/api/orders', orderData);
  return response.data;
};

// With query parameters
const searchProducts = async (query) => {
  const response = await api.get('/api/products', {
    params: { search: query }
  });
  return response.data;
};
```

### Using Pre-built API Functions

Import from `lib/api/examples.ts`:

```tsx
import { getProducts, addToCart, getOrders } from '@/lib/api/examples';

// In your component
const products = await getProducts({ category: 'fitness' });
await addToCart(productId, 2);
const orders = await getOrders();
```

## 🛡️ Security Best Practices

### Development
- Use `localhost` (not `127.0.0.1`) for both frontend and backend
- Keep `SESSION_SECURE_COOKIE=false` in development
- Ensure CORS is properly configured in Laravel

### Production
Update your `.env` files:

**Laravel `.env`:**
```env
SESSION_DOMAIN=yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_SECURE_COOKIE=true
FRONTEND_URL=https://yourdomain.com
APP_URL=https://api.yourdomain.com
```

**Next.js `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## 🐛 Troubleshooting

### CORS Errors
**Symptom:** "Access-Control-Allow-Origin" errors in console

**Solutions:**
1. Verify `withCredentials: true` in `lib/api/axios.ts`
2. Check `FRONTEND_URL` in Laravel `.env` matches your Next.js URL
3. Ensure `supports_credentials: true` in `config/cors.php`
4. Use same domain for both (e.g., both on `localhost`)

### 419 CSRF Token Mismatch
**Symptom:** 419 error on login/register

**Solutions:**
1. Ensure `getCsrfCookie()` is called before login/register
2. Check browser allows cookies (not blocking third-party cookies)
3. Verify `SESSION_DOMAIN` matches your domain
4. Clear browser cookies and try again

### Session Not Persisting
**Symptom:** User logged out after page refresh

**Solutions:**
1. Check `SESSION_DOMAIN` is correct (use `localhost` not `127.0.0.1`)
2. Verify cookies are being sent (check Network tab → Cookies)
3. Ensure `SESSION_DRIVER=cookie` in Laravel `.env`
4. Check browser isn't blocking cookies

### 401 Unauthorized on Protected Routes
**Symptom:** API returns 401 even after login

**Solutions:**
1. Verify user is logged in (`useAuth()` returns user)
2. Check `auth:sanctum` middleware is applied to routes
3. Ensure cookies are being sent with requests
4. Check session hasn't expired

### Network Tab Debugging
1. Open browser DevTools → Network tab
2. Look for `/sanctum/csrf-cookie` request - should set cookies
3. Check subsequent requests include `Cookie` header
4. Verify responses include `Set-Cookie` header

## 📚 API Reference

### authService Methods

```typescript
// Get CSRF cookie (called automatically before login/register)
await authService.getCsrfCookie();

// Register new user
await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123'
});

// Login
await authService.login('john@example.com', 'password123');

// Logout
await authService.logout();

// Get current user
await authService.getUser();

// Update profile
await authService.updateProfile({
  name: 'Jane Doe',
  email: 'jane@example.com'
});

// Change password
await authService.changePassword({
  current_password: 'oldpass',
  password: 'newpass',
  password_confirmation: 'newpass'
});
```

### useAuth Hook

```typescript
const {
  user,           // Current user object or null
  loading,        // Boolean: auth state loading
  login,          // Function: (email, password) => Promise
  register,       // Function: (data) => Promise
  logout,         // Function: () => Promise
  checkAuth       // Function: () => Promise (refresh user data)
} = useAuth();
```

## 🎯 Next Steps

1. ✅ Test the authentication flow
2. ✅ Protect your admin routes with `<ProtectedRoute>`
3. ✅ Add user profile management
4. ✅ Implement cart and order functionality
5. ✅ Add error handling and loading states
6. ✅ Configure for production deployment

## 📖 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 💡 Tips

- Always use the `api` instance from `lib/api/axios.ts` for authenticated requests
- Don't store sensitive data in localStorage - use HTTP-only cookies
- Test authentication flow in incognito mode to verify cookie behavior
- Use React Query or SWR for better data fetching and caching
- Implement proper error boundaries for production apps
