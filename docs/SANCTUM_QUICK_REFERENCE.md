# Laravel Sanctum - Quick Reference

## 🚀 Setup Checklist

- [x] Axios installed
- [x] API client configured (`lib/api/axios.ts`)
- [x] Auth service created (`lib/services/authService.ts`)
- [x] Auth context setup (`lib/context/AuthContext.tsx`)
- [x] Protected route component (`app/_components/ProtectedRoute.tsx`)
- [x] Login page updated
- [x] Register page updated
- [x] Root layout wrapped with AuthProvider
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Start Laravel backend (`php artisan serve`)
- [ ] Test authentication flow

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## 🔑 Common Code Snippets

### Use Auth Hook
```tsx
'use client';
import { useAuth } from '@/lib/context/AuthContext';

const { user, loading, login, logout } = useAuth();
```

### Protect a Route
```tsx
import ProtectedRoute from '@/app/_components/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

### Make API Call
```tsx
import api from '@/lib/api/axios';

const data = await api.get('/api/products');
```

### Login Form Handler
```tsx
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await login(email, password);
    router.push('/admin');
  } catch (error) {
    setError(error.response?.data?.message);
  }
};
```

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Check `FRONTEND_URL` in Laravel `.env` |
| 419 CSRF error | Clear cookies, ensure `getCsrfCookie()` is called |
| Session not persisting | Use `localhost` (not `127.0.0.1`) for both apps |
| 401 on protected routes | Verify cookies are being sent in Network tab |

## 📚 File Structure

```
├── lib/
│   ├── api/
│   │   ├── axios.ts          # Axios instance
│   │   └── examples.ts       # API call examples
│   ├── services/
│   │   └── authService.ts    # Auth methods
│   └── context/
│       └── AuthContext.tsx   # Auth state management
├── app/
│   ├── _components/
│   │   ├── ProtectedRoute.tsx
│   │   └── UserProfile.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── layout.tsx            # Wrapped with AuthProvider
└── .env.local                # API URL configuration
```

## 🎯 Next Steps

1. Create `.env.local` with your API URL
2. Start both servers (Laravel + Next.js)
3. Test registration at `/register`
4. Test login at `/login`
5. Verify protected routes redirect when not authenticated
6. Check cookies in browser DevTools

## 📖 Full Documentation

See `SANCTUM_SETUP_GUIDE.md` for complete documentation.
