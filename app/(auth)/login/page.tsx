
'use client';

import { useState, FormEvent, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);
  const isSubmitting = useRef(false);
  
  // Get redirect URL from query params or default to home
  const redirectTo = searchParams.get('redirect') || '/';

  // Load remembered email on mount (but not if coming from session expiration)
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    const sessionExpired = searchParams.get('sessionExpired') === 'true';

    if (rememberedEmail && !sessionExpired) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [searchParams]);

  // Redirect if already logged in (when page loads) - but NOT during form submission
  useEffect(() => {
    if (!authLoading && user && !hasRedirected.current && !isSubmitting.current) {
      hasRedirected.current = true;
      console.log("User already logged in, redirecting");
      
      // Use redirect parameter if available, otherwise default based on user type
      if (redirectTo && redirectTo !== '/') {
        console.log("Redirecting to:", redirectTo);
        router.push(redirectTo);
      } else if (user.user_type === 'admin') {
        console.log("Redirecting admin to /admin");
        router.push('/admin');
      } else {
        console.log("Redirecting user to /dashboard");
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    isSubmitting.current = true; // Mark that we're in submission flow
    hasRedirected.current = true; // Prevent useEffect redirect

    try {
      const response = await login(email, password);
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      // Get the logged-in user from response
      const loggedInUser = response.data.user;
      
      console.log('Login successful, user data:', loggedInUser);
      
      // Check for pending cart item
      const pendingCartItem = sessionStorage.getItem('pendingCartItem');
      
      if (pendingCartItem) {
        try {
          const item = JSON.parse(pendingCartItem);
          addToCart(item);
          sessionStorage.removeItem('pendingCartItem');
          toast.success('Product added to cart successfully!');
        } catch (error) {
          console.error('Failed to add pending cart item:', error);
        }
      }
      
      // Use redirect parameter if available, otherwise default based on user type
      if (redirectTo && redirectTo !== '/') {
        console.log('Login successful, redirecting to:', redirectTo);
        router.push(redirectTo);
      } else if (loggedInUser.user_type === 'admin') {
        console.log('Admin login successful, redirecting to /admin');
        router.push('/admin');
      } else {
        console.log('User login successful, redirecting to /dashboard');
        router.push('/dashboard');
      }
    } catch (err: any) {
      // Reset submission flag on error
      isSubmitting.current = false;
      hasRedirected.current = false;
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      setError(errorMessage);
      setLoading(false);
    }
    // Don't set loading to false on success - we're redirecting
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to access your account.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-border bg-gray-50/50 px-4 text-sm outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-sm font-medium text-[#0B3B2D] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 w-full rounded-xl border border-border bg-gray-50/50 px-4 pr-12 text-sm outline-none transition-all focus:border-[#0B3B2D] focus:ring-2 focus:ring-[#0B3B2D]/10 focus:bg-white placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-[#0B3B2D] focus:ring-[#0B3B2D]"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#0B3B2D] text-white font-medium hover:bg-[#0B3B2D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#0B3B2D]/20 mt-2 active:scale-[0.98]"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-[#0B3B2D] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full space-y-8">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
